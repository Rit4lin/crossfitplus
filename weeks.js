(() => {
  'use strict';
  const TOTAL = 52;
  const START = Date.UTC(2026, 7, 24);
  const DAY = 86400000;
  const weeks = Array.from({ length: TOTAL }, (_, index) => {
    const start = new Date(START + index * 7 * DAY);
    const end = new Date(START + (index * 7 + 6) * DAY);
    return { number: index + 1, start, end, month: start.toISOString().slice(0,7) };
  });
  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const current = Math.max(1, Math.min(TOTAL, Math.floor((todayUTC - START) / (7 * DAY)) + 1));
  const numberFormatter = new Intl.DateTimeFormat('es-ES', { day:'numeric', month:'short', timeZone:'UTC' });
  const fullFormatter = new Intl.DateTimeFormat('es-ES', { month:'long', year:'numeric', timeZone:'UTC' });
  const grid = document.getElementById('weeks-grid');
  const search = document.getElementById('week-search');
  const month = document.getElementById('month-filter');
  const more = document.getElementById('show-more');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('week-counter');
  let selected = current;
  let expanded = false;

  function label(week) {
    return numberFormatter.format(week.start) + ' – ' + numberFormatter.format(week.end);
  }
  function selectWeek(week) {
    selected = week.number;
    document.getElementById('preview-week').textContent = String(week.number).padStart(2,'0');
    document.getElementById('preview-date').textContent = label(week) + ' · ' + week.end.getUTCFullYear();
  }
  function requestWeek(week, immediate = false) {
    selectWeek(week);
    document.dispatchEvent(new CustomEvent('crossfit:access', { detail: { week: week.number, immediate } }));
  }
  const svg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l4 4v16H6zM15 2v5h4M9 12h6M9 16h6"/></svg>';
  function makeCard(week) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'week-card' + (week.number === current ? ' current' : '');
    card.setAttribute('aria-label', 'Abrir PDF de la semana ' + week.number + ', ' + label(week));
    card.innerHTML = '<span class="week-card-top"><span class="week-number">WEEK ' +
      String(week.number).padStart(2,'0') + '</span><span class="week-document-icon">' + svg +
      '</span></span><strong>Semana ' + String(week.number).padStart(2,'0') +
      '</strong><span class="week-dates">' + label(week) +
      '</span><span class="week-card-foot"><span class="available">PDF DISPONIBLE</span><span class="week-arrow" aria-hidden="true">↗</span></span>';
    card.addEventListener('click', () => requestWeek(week));
    return card;
  }
  function render() {
    const query = search.value.trim().toLocaleLowerCase('es-ES');
    const selectedMonth = month.value;
    const results = weeks.filter(w => {
      const matchesMonth = selectedMonth === 'all' || w.month === selectedMonth;
      const matchesQuery = !query || String(w.number) === query || ('semana '+w.number).includes(query) ||
        ('semana '+String(w.number).padStart(2,'0')).includes(query) || ('week '+w.number).includes(query);
      return matchesMonth && matchesQuery;
    }).sort((a,b) => {
      const aDistance = a.number <= current ? current-a.number : current+a.number;
      const bDistance = b.number <= current ? current-b.number : current+b.number;
      return aDistance-bDistance;
    });
    const limited = !query && selectedMonth === 'all' && !expanded;
    const displayed = limited ? results.slice(0,8) : results;
    const fragment = document.createDocumentFragment();
    displayed.forEach(w => fragment.appendChild(makeCard(w)));
    grid.replaceChildren(fragment);
    count.textContent = results.length + (results.length === 1 ? ' documento' : ' documentos');
    empty.hidden = results.length !== 0;
    more.hidden = !limited && (query !== '' || selectedMonth !== 'all');
    more.textContent = expanded ? 'Mostrar menos semanas' : 'Ver todas las semanas';
    const caret = document.createElement('span');
    caret.setAttribute('aria-hidden','true');
    caret.textContent = expanded ? '⌃' : '⌄';
    more.appendChild(caret);
    document.getElementById('list-heading').textContent = query || selectedMonth !== 'all' ? 'Resultados de búsqueda' : 'Todas las semanas';
  }

  const uniqueMonths = [...new Set(weeks.map(w => w.month))];
  uniqueMonths.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = fullFormatter.format(new Date(value + '-01T12:00:00Z'));
    month.append(option);
  });
  search.addEventListener('input', render);
  month.addEventListener('change', render);
  more.addEventListener('click', () => { expanded = !expanded; render(); if(!expanded) document.getElementById('semanas').scrollIntoView({behavior:'smooth'}); });
  document.getElementById('hero-cta').addEventListener('click', () => requestWeek(weeks[current-1]));
  document.getElementById('preview-open').addEventListener('click', () => requestWeek(weeks[selected-1]));
  document.getElementById('nav-archive').addEventListener('click', () => {
    expanded = true; month.value = 'all'; search.value = ''; render();
    document.getElementById('semanas').scrollIntoView({behavior:'smooth'});
  });
  selectWeek(weeks[current-1]);
  render();
})();
