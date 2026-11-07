/* =========================================================
   charts.js
   Las gráficas del dashboard. Usamos Chart.js.
   Los colores siguen la paleta del proyecto (crema,
   terracota, verde oliva) para que combinen con las tarjetas.
   ========================================================= */

const COL = {
  ink:        '#1a2622',
  inkSoft:    '#3d4a43',
  muted:      '#7a8078',
  terracotta: '#c25a3d',
  sage:       '#4f7350',
  gold:       '#b8894a',
  rust:       '#a8332a',
  sand:       '#d4a574',
  grid:       'rgba(26, 38, 34, 0.08)'
};

const charts = {};

function baseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: COL.inkSoft,
          font: { family: 'Inter', size: 12 },
          boxWidth: 10, boxHeight: 10, padding: 14,
          usePointStyle: true, pointStyle: 'rect'
        }
      },
      tooltip: {
        backgroundColor: COL.ink,
        titleFont: { family: 'Fraunces', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10, cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: COL.grid },
        ticks: { color: COL.muted, font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: COL.grid, drawTicks: false },
        border: { display: false },
        ticks: { color: COL.muted, font: { family: 'Inter', size: 11 } }
      }
    }
  };
}

function draw(id, cfg) {
  const el = document.getElementById(id);
  if (!el) return;
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(el, cfg);
}

function renderCharts(r) {
  const labels = ['Q1', 'Q2', 'Q3', 'Q4'];

  // Ventas vs COGS
  draw('chart-ventas', {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Ventas',
          data: r.ventasImporte,
          backgroundColor: COL.sage,
          borderRadius: 3,
          borderSkipped: false
        },
        {
          label: 'Costo de ventas',
          data: r.costoVentas,
          backgroundColor: COL.terracotta,
          borderRadius: 3,
          borderSkipped: false
        }
      ]
    },
    options: baseOptions()
  });

  // Producción
  draw('chart-produccion', {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cajas producidas',
        data: r.produccionUnidades,
        borderColor: COL.ink,
        backgroundColor: 'rgba(26, 38, 34, 0.08)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: COL.ink,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    },
    options: baseOptions()
  });

  // Utilidades
  draw('chart-utilidad', {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Utilidad bruta',
          data: r.utilidadBruta,
          backgroundColor: COL.sage,
          borderRadius: 3,
          borderSkipped: false
        },
        {
          label: 'Utilidad de operación',
          data: r.utilidadOperacion,
          backgroundColor: COL.gold,
          borderRadius: 3,
          borderSkipped: false
        },
        {
          label: 'Utilidad neta',
          data: r.utilidadNeta,
          backgroundColor: COL.terracotta,
          borderRadius: 3,
          borderSkipped: false
        }
      ]
    },
    options: baseOptions()
  });

  // Composición del costo
  draw('chart-composicion', {
    type: 'doughnut',
    data: {
      labels: ['Materia prima', 'Mano de obra', 'GIF'],
      datasets: [{
        data: [
          r.consumoMpImporte.reduce((a, b) => a + b, 0),
          r.costoMod.reduce((a, b) => a + b, 0),
          r.gifTotal.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [COL.terracotta, COL.sage, COL.gold],
        borderColor: '#faf7f1',
        borderWidth: 4,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: COL.inkSoft,
            font: { family: 'Inter', size: 12 },
            boxWidth: 10, boxHeight: 10, padding: 16,
            usePointStyle: true, pointStyle: 'rect'
          }
        },
        tooltip: baseOptions().plugins.tooltip
      }
    }
  });
}