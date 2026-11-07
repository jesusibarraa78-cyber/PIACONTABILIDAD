/* =========================================================
   app.js
   Controlador principal: estado, render, eventos, exportación.
   Guarda los supuestos en localStorage para que no se pierdan
   si se recarga la página.
   ========================================================= */

const KEY = 'presufacil_v1';
let state = cargarEstado() || JSON.parse(JSON.stringify(DEFAULTS));
let res = calcularPresupuestos(state);

function cargarEstado() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function guardarEstado() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

/* ---------- Helpers para armar tablas ---------- */
function tabla(rows) {
  const head = `<thead><tr>
    <th>Concepto</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Total</th>
  </tr></thead>`;
  return `<div class="table-wrap"><table class="budget">${head}<tbody>${rows}</tbody></table></div>`;
}

function fila(label, data, total, opts = {}) {
  const cls = opts.total ? 'total-row' : (opts.sub ? 'sub-row' : '');
  return `<tr class="${cls}">
    <td>${label}</td>
    ${data.map(v => `<td>${v}</td>`).join('')}
    <td>${total}</td>
  </tr>`;
}

/* ---------- Render de cada tabla ---------- */
function renderVentas() {
  const r = res;
  const rows = [
    fila('Cajas vendidas', r.ventasUnidades.map(fmtNum), fmtNum(r.anual.ventasUnidades)),
    fila('Precio por caja', r.ventasUnidades.map(() => fmtMoney(state.precio)), '—'),
    fila('Ventas totales', r.ventasImporte.map(fmtMoney), fmtMoney(r.anual.ventasImporte), { total: true })
  ].join('');
  document.getElementById('tabla-ventas').innerHTML = tabla(rows);
}

function renderProduccion() {
  const r = res;
  const rows = [
    fila('Ventas (cajas)', r.ventasUnidades.map(fmtNum), fmtNum(r.anual.ventasUnidades)),
    fila('(+) IF PT', r.ifPt.map(fmtNum), fmtNum(r.ifPt.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) II PT', r.iiPt.map(fmtNum), fmtNum(r.iiPt.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Producción requerida', r.produccionUnidades.map(fmtNum), fmtNum(r.anual.produccionUnidades), { total: true })
  ].join('');
  document.getElementById('tabla-produccion').innerHTML = tabla(rows);
}

function renderCompras() {
  const r = res;
  const rows = [
    fila('Producción (cajas)', r.produccionUnidades.map(fmtNum), fmtNum(r.anual.produccionUnidades)),
    fila('Consumo de MP (kg)', r.consumoMpKg.map(fmtNum), fmtNum(r.consumoMpKg.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(+) IF MP (kg)', r.ifMpKg.map(fmtNum), fmtNum(r.ifMpKg.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) II MP (kg)', r.iiMpKg.map(fmtNum), fmtNum(r.iiMpKg.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Compras de MP (kg)', r.comprasMpKg.map(fmtNum), fmtNum(r.comprasMpKg.reduce((a, b) => a + b, 0)), { total: true }),
    fila('Costo por kg', r.comprasMpKg.map(() => fmtMoney(state.costoMp)), '—'),
    fila('Compras de MP ($)', r.comprasMpImporte.map(fmtMoney), fmtMoney(r.anual.comprasMpImporte), { total: true })
  ].join('');
  document.getElementById('tabla-compras').innerHTML = tabla(rows);
}

function renderMod() {
  const r = res;
  const rows = [
    fila('Producción (cajas)', r.produccionUnidades.map(fmtNum), fmtNum(r.anual.produccionUnidades)),
    fila('Horas MOD por caja', r.produccionUnidades.map(() => fmtNum(state.horasMod)), '—'),
    fila('Total horas MOD', r.horasMod.map(fmtNum), fmtNum(r.horasMod.reduce((a, b) => a + b, 0)), { total: true }),
    fila('Tarifa por hora', r.horasMod.map(() => fmtMoney(state.tarifaMod)), '—'),
    fila('Costo de MOD', r.costoMod.map(fmtMoney), fmtMoney(r.anual.costoMod), { total: true })
  ].join('');
  document.getElementById('tabla-mod').innerHTML = tabla(rows);
}

function renderGif() {
  const r = res;
  const rows = [
    fila('GIF variables', r.gifVariable.map(fmtMoney), fmtMoney(r.gifVariable.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('GIF fijos', r.gifFijoArr.map(fmtMoney), fmtMoney(r.gifFijoArr.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('GIF totales', r.gifTotal.map(fmtMoney), fmtMoney(r.anual.gifTotal), { total: true })
  ].join('');
  document.getElementById('tabla-gif').innerHTML = tabla(rows);
}

function renderGastos() {
  const r = res;
  const rows = [
    fila('Gastos de venta fijos', r.gvFijoArr.map(fmtMoney), fmtMoney(r.gvFijoArr.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Gastos de venta variables', r.gvVariable.map(fmtMoney), fmtMoney(r.gvVariable.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Total gastos de venta', r.gvTotal.map(fmtMoney), fmtMoney(r.gvTotal.reduce((a, b) => a + b, 0))),
    fila('Gastos de administración', r.gaFijoArr.map(fmtMoney), fmtMoney(r.gaFijoArr.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Total gastos de operación', r.gastosOperacion.map(fmtMoney), fmtMoney(r.anual.gastosOperacion), { total: true })
  ].join('');
  document.getElementById('tabla-gastos').innerHTML = tabla(rows);
}

function renderResultados() {
  const r = res;
  const rows = [
    fila('Ventas', r.ventasImporte.map(fmtMoney), fmtMoney(r.anual.ventasImporte)),
    fila('(−) Costo de ventas', r.costoVentas.map(fmtMoney), fmtMoney(r.anual.costoVentas), { sub: true }),
    fila('Utilidad bruta', r.utilidadBruta.map(fmtMoney), fmtMoney(r.anual.utilidadBruta)),
    fila('(−) Gastos de operación', r.gastosOperacion.map(fmtMoney), fmtMoney(r.anual.gastosOperacion), { sub: true }),
    fila('Utilidad de operación', r.utilidadOperacion.map(fmtMoney), fmtMoney(r.anual.utilidadOperacion)),
    fila('(−) ISR y PTU', r.impuestos.map(fmtMoney), fmtMoney(r.anual.impuestos), { sub: true }),
    fila('Utilidad neta', r.utilidadNeta.map(fmtMoney), fmtMoney(r.anual.utilidadNeta), { total: true })
  ].join('');
  document.getElementById('tabla-resultados').innerHTML = tabla(rows);
}

function renderFlujo() {
  const r = res;
  const rows = [
    fila('Cobranza', r.cobranza.map(fmtMoney), fmtMoney(r.anual.cobranza)),
    fila('(−) Pagos de compras MP', r.pagosCompras.map(fmtMoney), fmtMoney(r.pagosCompras.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) Pagos de MOD', r.pagosMod.map(fmtMoney), fmtMoney(r.pagosMod.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) Pagos de GIF', r.pagosGif.map(fmtMoney), fmtMoney(r.pagosGif.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) Pagos de gastos op.', r.pagosGastos.map(fmtMoney), fmtMoney(r.pagosGastos.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('(−) Pago de impuestos', r.pagosImpuestos.map(fmtMoney), fmtMoney(r.pagosImpuestos.reduce((a, b) => a + b, 0)), { sub: true }),
    fila('Total de pagos', r.totalPagos.map(fmtMoney), fmtMoney(r.anual.totalPagos)),
    fila('Flujo neto del trimestre', r.flujoNeto.map(fmtMoney), fmtMoney(r.anual.flujoNeto), { total: true }),
    fila('Saldo inicial', r.saldoInicial.map(fmtMoney), '—'),
    fila('Saldo final', r.saldoFinal.map(fmtMoney), fmtMoney(r.anual.saldoFinal), { total: true })
  ].join('');
  document.getElementById('tabla-flujo').innerHTML = tabla(rows);
}

function renderKpis() {
  const a = res.anual;
  document.getElementById('kpi-ventas').textContent = fmtMoney(a.ventasImporte);
  document.getElementById('kpi-ventas-units').textContent = fmtNum(a.ventasUnidades) + ' cajas vendidas';
  document.getElementById('kpi-cogs').textContent = fmtMoney(a.costoVentas);
  document.getElementById('kpi-bruta').textContent = fmtMoney(a.utilidadBruta);
  document.getElementById('kpi-margen').textContent = 'Margen ' + fmtPct(a.utilidadBruta / a.ventasImporte);

  const neta = document.getElementById('kpi-neta');
  neta.textContent = fmtMoney(a.utilidadNeta);
  neta.className = 'kpi-value ' + (a.utilidadNeta >= 0 ? 'positive' : 'negative');
  document.getElementById('kpi-margen-neto').textContent = 'Margen ' + fmtPct(a.utilidadNeta / a.ventasImporte);
}

function renderTodo() {
  res = calcularPresupuestos(state);
  renderKpis();
  renderVentas();
  renderProduccion();
  renderCompras();
  renderMod();
  renderGif();
  renderGastos();
  renderResultados();
  renderFlujo();
  renderCharts(res);
  guardarEstado();
}

/* ---------- Formulario ---------- */
function llenarFormulario() {
  const form = document.getElementById('form-supuestos');
  Array.from(form.elements).forEach(el => {
    if (!el.name) return;
    const m = el.name.match(/^ventas\[(\d)\]$/);
    if (m) el.value = state.ventas[Number(m[1])];
    else if (el.name in state) el.value = state[el.name];
  });
}

function activarFormulario() {
  const form = document.getElementById('form-supuestos');
  form.addEventListener('input', () => {
    Array.from(form.elements).forEach(el => {
      if (!el.name) return;
      const m = el.name.match(/^ventas\[(\d)\]$/);
      const v = Number(el.value) || 0;
      if (m) state.ventas[Number(m[1])] = v;
      else if (el.name in state) state[el.name] = v;
    });
    renderTodo();
  });
}

/* ---------- Navegación ---------- */
function activarNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.section;
      document.querySelectorAll('.section').forEach(s => {
        s.classList.toggle('active', s.id === id);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ---------- Acciones ---------- */
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function exportarCSV() {
  const r = res;
  const rows = [
    ['PresuFácil · Caso Dulces del Norte · Resumen anual'],
    ['Concepto', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    ['Ventas (cajas)', ...r.ventasUnidades, r.anual.ventasUnidades],
    ['Ventas ($)', ...r.ventasImporte, r.anual.ventasImporte],
    ['Producción (cajas)', ...r.produccionUnidades, r.anual.produccionUnidades],
    ['Compras de MP ($)', ...r.comprasMpImporte, r.anual.comprasMpImporte],
    ['Costo de MOD ($)', ...r.costoMod, r.anual.costoMod],
    ['GIF totales ($)', ...r.gifTotal, r.anual.gifTotal],
    ['Costo de ventas ($)', ...r.costoVentas, r.anual.costoVentas],
    ['Gastos de operación ($)', ...r.gastosOperacion, r.anual.gastosOperacion],
    ['Utilidad bruta ($)', ...r.utilidadBruta, r.anual.utilidadBruta],
    ['Utilidad de operación ($)', ...r.utilidadOperacion, r.anual.utilidadOperacion],
    ['Impuestos ($)', ...r.impuestos, r.anual.impuestos],
    ['Utilidad neta ($)', ...r.utilidadNeta, r.anual.utilidadNeta],
    ['Flujo neto ($)', ...r.flujoNeto, r.anual.flujoNeto],
    ['Saldo final ($)', ...r.saldoFinal, r.anual.saldoFinal]
  ];
  const csv = rows.map(rw => rw.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'presupuesto_dulces_del_norte.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast('Archivo descargado');
}

function resetear() {
  if (!confirm('¿Restablecer los datos del caso a su estado original?')) return;
  state = JSON.parse(JSON.stringify(DEFAULTS));
  llenarFormulario();
  renderTodo();
  toast('Datos restablecidos');
}

document.addEventListener('DOMContentLoaded', () => {
  llenarFormulario();
  activarFormulario();
  activarNav();
  document.getElementById('btn-reset').addEventListener('click', resetear);
  document.getElementById('btn-export').addEventListener('click', exportarCSV);
  renderTodo();
});