(() => {
  'use strict';
  // La portada ofrece un resumen de programación. El PDF solo se intenta abrir desde su ficha.
  document.getElementById('hero-cta')?.remove();
  document.getElementById('sidebar-upgrade')?.closest('.sidebar-feature')?.remove();

  const stats = document.querySelector('.stats');
  if (!stats) return;
  const section = document.createElement('section');
  section.className = 'insights';
  section.id = 'rendimiento';
  section.setAttribute('aria-labelledby', 'insights-title');
  section.innerHTML = [
    '<div class="insights-head"><div><div class="insights-kicker">ANÁLISIS DE PROGRAMACIÓN</div>',
    '<h2 id="insights-title">Evolución de la carga<span class="lime-dot">.</span></h2>',
    '<p>Distribución de volumen, intensidad y trabajo previsto por microciclo.</p></div>',
    '<label class="insights-selector">Consultar <select id="insights-week" aria-label="Seleccionar semana del análisis"></select></label></div>',
    '<div class="insights-grid">',
    '<article class="insight-card insight-chart"><div class="insight-top"><div>',
    '<div class="insight-caption">TENDENCIA DE CARGA · ÚLTIMAS 10 SEMANAS</div>',
    '<strong class="insight-title">Volumen de entrenamiento</strong></div>',
    '<span class="insight-tag">PLANIFICACIÓN</span></div>',
    '<div class="insight-values"><strong class="insight-amount" id="insights-load">— <small>UA</small></strong>',
    '<span class="insight-delta" id="insights-delta"></span></div>',
    '<p class="insight-description">Carga prevista frente al microciclo anterior.</p>',
    '<svg class="load-svg" id="insights-graph" viewBox="0 0 680 230" role="img" aria-label="Evolución de la carga semanal prevista"></svg>',
    '<p class="load-axis-note">UA: unidades de carga relativas · estimaciones de programación</p></article>',
    '<article class="insight-card"><div class="insight-top"><div>',
    '<div class="insight-caption">COMPOSICIÓN DEL MICROCICLO</div>',
    '<strong class="insight-title">Distribución del trabajo</strong></div></div>',
    '<div class="distribution-body"><div id="insights-donut" class="distribution-donut"><span>5<small>sesiones</small></span></div>',
    '<div class="mix-legend" id="insights-legend"></div></div></article>',
    '<article class="insight-card"><div class="insights-headline-compact"><div>',
    '<div class="insight-caption">REPARTO POR JORNADA</div>',
    '<strong class="insight-title">Intensidad prevista</strong></div>',
    '<span class="insight-stat-pill">5 DÍAS</span></div>',
    '<div class="daily-bars" id="insights-daily" role="img" aria-label="Intensidad relativa de lunes a viernes"></div>',
    '<p class="daily-note">Alternancia de sesiones de carga, técnica y recuperación.</p>',
    '</article></div>'
  ].join('');
  stats.insertAdjacentElement('afterend', section);
})();
