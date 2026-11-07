# Conclusiones

## Conclusión general del equipo

Al principio pensábamos que este proyecto iba a ser más que nada de programación, porque éramos del área de tecnología. Pero terminamos dándonos cuenta de que el reto real era contable: entender por qué el IF de producto terminado de un trimestre se convierte en el II del siguiente, por qué el consumo de materia prima depende de la producción y no de las ventas, y por qué la utilidad y el efectivo no son lo mismo.

PresuFácil no es perfecta, le faltan cosas (por ejemplo, todavía no compara escenarios ni maneja múltiples productos), pero sí resuelve el problema central del Presupuesto Maestro para un caso realista y los resultados son verificables. Nos llevamos tres aprendizajes principales:

1. La Contabilidad Administrativa no se puede automatizar si no se entiende primero. No basta con pasar fórmulas a código: hay que saber qué significan.
2. El código limpio ayuda, pero el código correcto es primero. Tuvimos que reescribir `calculos.js` tres veces antes de que cuadraran los números.
3. Presentar en vivo es distinto a que funcione. Aprendimos a explicar el proyecto como si la maestra no fuera a abrir el código.

---

## Reflexiones individuales

### [Nombre del integrante 1] — [Matrícula]

Mi parte fue el presupuesto de producción y las compras de materia prima. El primer cálculo nos salió mal porque confundimos el IF con el II: en el Q1 estábamos poniendo como inventario final el mismo del Q2, cuando en realidad el IF del Q1 es el II del Q2. Lo corregimos y hasta entonces cuadraron los números.

Lo que más me sirvió fue hacer los cálculos a mano en el cuaderno antes de programarlos. Cuando los pasé al código, ya sabía qué resultado esperar, así que cuando algo salía raro lo detectaba de inmediato. Eso fue lo que nos salvó varias veces.

### [Nombre del integrante 2] — [Matrícula]

Yo me encargué del estado de resultados y del flujo de efectivo. Confieso que al inicio usé el costo de producción como costo de ventas y las utilidades nos salían con números que no cuadraban con nada. Fui a asesoría y la maestra me explicó la diferencia entre costeo absorbente y costeo directo, y ahí por fin entendí por qué había que sumar el II de PT y restar el IF.

El flujo de efectivo fue otra historia. La primera versión daba un saldo negativo en Q1 que no entendíamos. Resulta que estábamos asumiendo que todo se cobraba al contado, cuando en la vida real una PYME cobra con desfase. Cuando agregamos el porcentaje de cobranza y el pago parcial de compras, el flujo empezó a tener sentido.

### [Nombre del integrante 3] — [Matrícula]

Mi parte fue el dashboard y las gráficas. La primera versión se veía como todos los dashboards de tutorial que encuentras en internet: fondo morado, gradientes de colores, glassmorphism. En una de las revisiones con el equipo nos dimos cuenta de que se veía genérico y no le decía nada al usuario.

Lo rehicimos por completo en un estilo más editorial, con fondo crema y tipografía serif. Aprendí que el diseño no es solo que se vea bonito: el color y la tipografía también comunican. Un contador que abre la herramienta tiene que sentir que está frente a algo serio, no frente a un videojuego.

### [Nombre del integrante 4] — [Matrícula]

A mí me tocó la integración general y la documentación. Al principio quería que todas las tablas mostraran mucha información, pero me di cuenta de que entre más detalle ponía, menos se entendía. Aprendí a recortar: al final dejamos solo las filas que aportan algo y el resto se puede ver en el CSV si alguien lo necesita.

También me tocó armar el documento. Escribí varias versiones antes de llegar a esta, porque las primeras se sentían muy acartonadas, como de reporte de gobierno. Cuando por fin le puse el nombre Dulces del Norte y le metí lo que nos había costado trabajo, se sintió como algo nuestro.

> _Nota para el equipo: reemplacen los nombres y las matrículas por los reales, y ajusten cada reflexión a lo que de verdad les pasó a ustedes. Si alguien no estuvo en producción sino en diseño, que lo diga. Lo importante es que cada texto sea auténtico._