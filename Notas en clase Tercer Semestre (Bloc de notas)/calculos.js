/* =========================================================
   calculos.js
   Motor de cálculo del Presupuesto Maestro.
   Todo se calcula aquí y de aquí sale el objeto que
   consumen las tablas y las gráficas.
   Datos base = caso Dulces del Norte.
   ========================================================= */

const DEFAULTS = {
  // Ventas
  ventas: [800, 950, 1100, 1600],
  precio: 180,
  ventasSigQ1: 1800,

  // Inventarios PT
  ifPtPct: 0.10,
  iiPtQ1: 80,
  iiPtCostoUnit: 115,

  // Materia prima
  mpPorUnidad: 1.0,
  costoMp: 40,
  ifMpPct: 0.20,
  iiMpQ1: 200,

  // Mano de obra
  horasMod: 0.6,
  tarifaMod: 85,

  // GIF
  gifVar: 10,
  gifFijo: 12000,

  // Gastos operativos
  gvFijo: 6000,
  gvVarPct: 0.03,
  gaFijo: 4500,

  // Impuestos y cobranza
  isrPct: 0.30,
  cobroQ: 0.75,
  pagoQ: 0.65
};

/**
 * Hace todos los cálculos del presupuesto. Regresa un objeto
 * con arreglos de 4 posiciones (Q1..Q4) para cada partida.
 */
function calcularPresupuestos(d) {
  const Q = [0, 1, 2, 3];
  const sum = a => a.reduce((x, y) => x + y, 0);

  // 1) Ventas
  const ventasUnidades = d.ventas.slice();
  const ventasImporte  = ventasUnidades.map(u => u * d.precio);

  // 2) Producción
  // OJO: el IF PT de cada trimestre es el II PT del siguiente.
  // Aquí nos equivocamos varias veces antes de que quedara.
  const ifPt = [
    ventasUnidades[1] * d.ifPtPct,
    ventasUnidades[2] * d.ifPtPct,
    ventasUnidades[3] * d.ifPtPct,
    d.ventasSigQ1   * d.ifPtPct
  ];
  const iiPt = [ d.iiPtQ1, ifPt[0], ifPt[1], ifPt[2] ];
  const produccionUnidades = Q.map(i =>
    ventasUnidades[i] + ifPt[i] - iiPt[i]
  );

  // 3) Compras de MP
  const consumoMpKg = produccionUnidades.map(p => p * d.mpPorUnidad);
  const ifMpKg = [
    consumoMpKg[1] * d.ifMpPct,
    consumoMpKg[2] * d.ifMpPct,
    consumoMpKg[3] * d.ifMpPct,
    consumoMpKg[3] * d.ifMpPct // estimado, no tenemos Q1 del año siguiente en MP
  ];
  const iiMpKg = [ d.iiMpQ1, ifMpKg[0], ifMpKg[1], ifMpKg[2] ];
  const comprasMpKg     = Q.map(i => consumoMpKg[i] + ifMpKg[i] - iiMpKg[i]);
  const comprasMpImporte = comprasMpKg.map(kg => kg * d.costoMp);
  const consumoMpImporte = consumoMpKg.map(kg => kg * d.costoMp);

  // 4) MOD
  const horasMod = produccionUnidades.map(p => p * d.horasMod);
  const costoMod = horasMod.map(h => h * d.tarifaMod);

  // 5) GIF
  const gifVariable = produccionUnidades.map(p => p * d.gifVar);
  const gifFijoArr  = Q.map(() => d.gifFijo);
  const gifTotal    = Q.map(i => gifVariable[i] + gifFijoArr[i]);

  // 6) Costo de producción
  const costoProduccion = Q.map(i =>
    consumoMpImporte[i] + costoMod[i] + gifTotal[i]
  );
  const costoUnitarioProd = Q.map(i =>
    produccionUnidades[i] > 0 ? costoProduccion[i] / produccionUnidades[i] : 0
  );

  // 7) Costo de ventas con costeo absorbente
  const iiPtCostoUnit = [
    d.iiPtCostoUnit,
    costoUnitarioProd[0],
    costoUnitarioProd[1],
    costoUnitarioProd[2]
  ];
  const iiPtCosto = iiPt.map((u, i) => u * iiPtCostoUnit[i]);
  const ifPtCosto = ifPt.map((u, i) => u * costoUnitarioProd[i]);
  const costoVentas = Q.map(i =>
    costoProduccion[i] + iiPtCosto[i] - ifPtCosto[i]
  );

  // 8) Gastos de operación
  const gvVariable = ventasImporte.map(v => v * d.gvVarPct);
  const gvFijoArr  = Q.map(() => d.gvFijo);
  const gvTotal    = Q.map(i => gvFijoArr[i] + gvVariable[i]);
  const gaFijoArr  = Q.map(() => d.gaFijo);
  const gastosOperacion = Q.map(i => gvTotal[i] + gaFijoArr[i]);

  // 9) Estado de resultados
  const utilidadBruta     = Q.map(i => ventasImporte[i] - costoVentas[i]);
  const utilidadOperacion = Q.map(i => utilidadBruta[i] - gastosOperacion[i]);
  const impuestos         = utilidadOperacion.map(u => u > 0 ? u * d.isrPct : 0);
  const utilidadNeta      = Q.map(i => utilidadOperacion[i] - impuestos[i]);

  // 10) Flujo de efectivo (con desfase)
  const cobranza = Q.map(i => {
    const actual   = ventasImporte[i] * d.cobroQ;
    const anterior = i > 0 ? ventasImporte[i - 1] * (1 - d.cobroQ) : 0;
    return actual + anterior;
  });
  const pagosCompras = Q.map(i => {
    const actual   = comprasMpImporte[i] * d.pagoQ;
    const anterior = i > 0 ? comprasMpImporte[i - 1] * (1 - d.pagoQ) : 0;
    return actual + anterior;
  });

  // los demás pagos los asumimos al contado
  const pagosMod       = costoMod.slice();
  const pagosGif       = gifTotal.slice();
  const pagosGastos    = gastosOperacion.slice();
  const pagosImpuestos = impuestos.slice();

  const totalPagos = Q.map(i =>
    pagosCompras[i] + pagosMod[i] + pagosGif[i] + pagosGastos[i] + pagosImpuestos[i]
  );
  const flujoNeto = Q.map(i => cobranza[i] - totalPagos[i]);

  const saldoInicial = [0, 0, 0, 0];
  const saldoFinal   = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    saldoInicial[i] = i === 0 ? 0 : saldoFinal[i - 1];
    saldoFinal[i]   = saldoInicial[i] + flujoNeto[i];
  }

  // Totales del año
  const anual = {
    ventasUnidades:     sum(ventasUnidades),
    ventasImporte:      sum(ventasImporte),
    produccionUnidades: sum(produccionUnidades),
    comprasMpImporte:   sum(comprasMpImporte),
    costoMod:           sum(costoMod),
    gifTotal:           sum(gifTotal),
    costoProduccion:    sum(costoProduccion),
    costoVentas:        sum(costoVentas),
    gastosOperacion:    sum(gastosOperacion),
    utilidadBruta:      sum(utilidadBruta),
    utilidadOperacion:  sum(utilidadOperacion),
    impuestos:          sum(impuestos),
    utilidadNeta:       sum(utilidadNeta),
    cobranza:           sum(cobranza),
    totalPagos:         sum(totalPagos),
    flujoNeto:          sum(flujoNeto),
    saldoFinal:         saldoFinal[3]
  };

  return {
    supuestos: d,
    ventasUnidades, ventasImporte,
    ifPt, iiPt, produccionUnidades,
    consumoMpKg, ifMpKg, iiMpKg, comprasMpKg, comprasMpImporte, consumoMpImporte,
    horasMod, costoMod,
    gifVariable, gifFijoArr, gifTotal,
    costoProduccion, costoUnitarioProd,
    iiPtCosto, ifPtCosto, costoVentas,
    gvVariable, gvFijoArr, gvTotal, gaFijoArr, gastosOperacion,
    utilidadBruta, utilidadOperacion, impuestos, utilidadNeta,
    cobranza, pagosCompras, pagosMod, pagosGif, pagosGastos, pagosImpuestos,
    totalPagos, flujoNeto, saldoInicial, saldoFinal,
    anual
  };
}

/* Formato de números */
const fmtMoney = n => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 2 });
const fmtNum   = n => Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 2 });
const fmtPct   = n => (Number(n || 0) * 100).toFixed(1) + '%';