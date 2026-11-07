# PROYECTO INTEGRADOR DE APRENDIZAJE

## PresuFácil: herramienta de Presupuesto Maestro aplicada a Dulces del Norte, S.A. de C.V.

**Unidad de aprendizaje:** Contabilidad Administrativa
**Programa educativo:** Licenciatura en Tecnología de Información
**Semestre:** Tercero
**Facultad:** Contaduría Pública y Administración, UANL
**Periodo:** Agosto – Diciembre 2026
**Docente:** Dra. Alicia Villarreal

**Integrantes del equipo:**
- [Nombre completo] — [Matrícula]
- [Nombre completo] — [Matrícula]
- [Nombre completo] — [Matrícula]
- [Nombre completo] — [Matrícula]

---

## Introducción

Cuando nos enteramos de que el proyecto final de Contabilidad Administrativa era hacer una herramienta para el Presupuesto Maestro, lo primero que se nos ocurrió fue hacer una hoja de Excel con macros. Pero luego nos pusimos a pensar en el contexto real: la mayoría de las pequeñas y medianas empresas de nuestra zona no tienen la versión de Excel que soporta macros, o no las saben usar, o el archivo termina con contraseñas que solo entiende una persona. Entonces nos decidimos por otra cosa: una página web que corra en cualquier navegador, sin instalar nada, que abra igual en una laptop que en el celular.

Para que el proyecto no se quedara en teoría, inventamos un caso de una empresa realista: **Dulces del Norte, S.A. de C.V.**, una microempresa regiomontana que hace galletas artesanales surtidas y las vende a cafeterías y tiendas de conveniencia. Elegimos ese giro porque tiene una estacionalidad muy marcada (vende mucho más en el último trimestre por la temporada navideña) y eso nos obligaba a que el presupuesto realmente reflejara ese comportamiento y no solo fuera un ejercicio plano.

## La necesidad que atiende

En la práctica, el Presupuesto Maestro de una PYME se hace con mucho esfuerzo manual y pocas veces se actualiza. Cuando cambia un supuesto, como el precio o el número de unidades esperadas, hay que rehacer muchos cálculos a mano, y es fácil equivocarse en la cadena: por ejemplo, si suben las ventas, sube la producción, y si sube la producción, sube el consumo de materia prima y el IF de producto terminado del siguiente trimestre. Con una hoja de cálculo sin estructura, esto suele terminar en errores que nadie detecta hasta que cierra el año.

La herramienta que desarrollamos resuelve tres cosas concretas:

1. **Centraliza los supuestos** en un solo formulario. Ya no hay que buscar entre celdas para cambiar un dato.
2. **Encadena los presupuestos automáticamente**. El IF de producto terminado de un trimestre se convierte en el II del siguiente, sin que el usuario tenga que copiarlo a mano.
3. **Muestra resultados ejecutivos** con tablas y gráficas que cualquier administrador puede leer sin ser experto en Excel.

## Objetivo

Desarrollar una aplicación web que automatice la elaboración del Presupuesto Maestro de una empresa, aplicando los conceptos de Contabilidad Administrativa vistos en el curso y usando las herramientas de programación web de la carrera de LTI.

**Objetivos específicos:**

- Modelar en código los ocho presupuestos que integran el Presupuesto Maestro.
- Permitir la modificación de supuestos con recálculo automático.
- Presentar los resultados en tablas verificables y gráficas ejecutivas.
- Exportar los resultados a CSV para que el contador los pueda revisar en Excel.

## Descripción funcional

La herramienta tiene nueve vistas organizadas en un menú lateral:

| Vista | Qué hace |
|---|---|
| Resumen general | Muestra los KPIs (ventas, costo de ventas, utilidad bruta, utilidad neta) y cuatro gráficas. |
| Supuestos | Formulario con todos los datos de entrada del caso Dulces del Norte. |
| 1. Ventas | Presupuesto de ventas en cajas y en pesos, por trimestre. |
| 2. Producción | Presupuesto de producción usando la fórmula Ventas + IF PT − II PT. |
| 3. Compras de MP | Compras de materia prima en kg y en pesos. |
| 4. Mano de obra | Horas MOD y costo total por trimestre. |
| 5. GIF | Gastos indirectos de fabricación variables y fijos. |
| 6. Gastos de operación | Gastos de venta y administración. |
| 7. Estado de resultados | Utilidad bruta, de operación y neta, con impuestos. |
| 8. Flujo de efectivo | Cobranza y pagos con desfase entre trimestres. |

## Fundamento contable

Estas son las fórmulas que usamos en el código. Las sacamos del apunte del curso y las verificamos con ejercicios a mano antes de programarlas:

**Presupuesto de ventas**
`Ventas = Unidades × Precio`

**Presupuesto de producción**
`Producción = Ventas + IF PT − II PT`

**Presupuesto de compras de materia prima**
`Consumo MP = Producción × Requerimiento unitario`
`Compras = Consumo MP + IF MP − II MP`

**Mano de obra directa**
`Costo MOD = Producción × Horas por unidad × Tarifa`

**Gastos indirectos de fabricación**
`GIF = (Producción × GIF variable unitario) + GIF fijos del período`

**Costo de producción**
`Costo Producción = Consumo MP + MOD + GIF`

**Costo de ventas (costeo absorbente)**
`COGS = Costo Producción + II PT − IF PT`

**Estado de resultados**
`Utilidad Bruta = Ventas − COGS`
`Utilidad de Operación = Utilidad Bruta − Gastos de Operación`
`Utilidad Neta = Utilidad de Operación − Impuestos`

**Flujo de efectivo**
`Cobranza = Ventas × % cobro + Ventas (trim. anterior) × (1 − % cobro)`
`Flujo Neto = Cobranza − Total de Pagos`

## El caso: Dulces del Norte, S.A. de C.V.

Los datos que cargamos por defecto son estos:

| Supuesto | Valor |
|---|---|
| Cajas vendidas Q1 | 800 |
| Cajas vendidas Q2 | 950 |
| Cajas vendidas Q3 | 1,100 |
| Cajas vendidas Q4 (temporada navideña) | 1,600 |
| Precio por caja | $180 |
| MP por caja | 1 kg a $40 |
| Horas MOD por caja | 0.6 h a $85 |
| GIF variable por caja | $10 |
| GIF fijos por trimestre | $12,000 |
| Gastos de venta fijos / trimestre | $6,000 |
| Gastos de venta variables | 3% de ventas |
| Gastos de administración / trimestre | $4,500 |
| ISR + PTU | 30% |
| Cobranza dentro del trimestre | 75% |
| Pago de compras dentro del trimestre | 65% |

Con estos datos, el estado de resultados anual queda así:

| Concepto | Importe |
|---|---:|
| Ventas | $801,000 |
| Costo de ventas | $497,236 |
| Utilidad bruta | $303,764 |
| Gastos de operación | $66,030 |
| Utilidad de operación | $237,734 |
| Impuestos | $71,320 |
| Utilidad neta | $166,414 |
| Margen neto | 20.8% |

El cuarto trimestre concentra aproximadamente el 36% de las ventas del año, lo cual es consistente con el comportamiento de una empresa de alimentos con estacionalidad navideña.

## Desarrollo tecnológico

Elegimos HTML, CSS y JavaScript por tres razones:

1. Corre en cualquier navegador sin instalar nada.
2. Se puede subir gratis a GitHub Pages o Netlify y queda con URL público.
3. Los compañeros de LTI ya traíamos bases de estos lenguajes.

Organizamos el código en tres archivos JavaScript con responsabilidades separadas:

- `calculos.js` — el motor de cálculo. No sabe nada de la interfaz: recibe supuestos y devuelve resultados. Es la parte que más revisamos porque cualquier error aquí afecta todo lo demás.
- `charts.js` — las cuatro gráficas del dashboard, dibujadas con Chart.js.
- `app.js` — el controlador: lee el formulario, actualiza el estado, redibuja las tablas y guarda los datos en `localStorage` para que no se pierdan al recargar.

El CSS es propio, sin frameworks. Decidimos usar una estética de tipo editorial financiero (fondo crema, tipografía serif, acentos en terracota y verde oliva) porque los dashboards morados con gradientes ya los vimos en todos lados y queríamos algo que se sintiera un poco más serio para el contexto contable.

## Evidencias

Las capturas de pantalla están en la carpeta `docs/evidencias/`:

1. `01_resumen.png` — Vista del dashboard con los KPIs y las gráficas.
2. `02_supuestos.png` — Formulario de datos de entrada.
3. `03_ventas.png` — Presupuesto de ventas.
4. `04_produccion.png` — Presupuesto de producción.
5. `05_compras.png` — Presupuesto de compras de materia prima.
6. `06_mod.png` — Mano de obra directa.
7. `07_gif.png` — Gastos indirectos de fabricación.
8. `08_resultados.png` — Estado de resultados proforma.
9. `09_flujo.png` — Flujo de efectivo presupuestado.
10. `10_exportacion.png` — Archivo CSV descargado.

**Enlace de acceso a la herramienta:** _(pegar aquí el enlace de GitHub Pages / Netlify después de publicarla)_

## Relación con la Contabilidad Administrativa

Este proyecto nos obligó a repasar varios temas de la materia que ya habíamos visto pero no habíamos aplicado juntos:

- **Presupuesto Maestro** como el sistema que integra los presupuestos operativos y financieros.
- **Costeo absorbente**, porque el costo de ventas incluye MP, MOD y GIF, no solo los gastos variables.
- **Interconexión entre presupuestos**: cambiar una venta afecta producción, compras, MOD, GIF, resultados y flujo. Esa cadena es la que más se nos dificultó reproducir en código.
- **Planeación financiera**, porque la utilidad no es lo mismo que la liquidez: una empresa puede tener utilidad y aun así quedarse sin efectivo si no planea la cobranza.

## Uso de inteligencia artificial

Usamos un asistente de IA (ChatGPT / Claude) al inicio del proyecto para armar la estructura base del código y para organizar el documento. Después:

- Revisamos cada cálculo contra ejercicios hechos a mano en el cuaderno.
- Corregimos el cálculo del IF PT del cuarto trimestre, que en la primera versión lo habíamos puesto en cero.
- Cambiamos por completo el diseño visual, porque la primera versión se veía como cualquier otro dashboard genérico.
- Verificamos con la maestra en asesoría la fórmula de costo de ventas para asegurarnos de que fuera costeo absorbente y no directo.

Podemos explicar línea por línea cada parte del código durante la presentación.