(() => {
  'use strict';
  const backdrop = document.getElementById('paywall');
  const loader = document.getElementById('loader');
  const close = document.getElementById('close-modal');
  const action = document.getElementById('subscribe');
  const restore = document.getElementById('restore');
  let timer = null;
  let previousFocus = null;

  function open(week, immediate) {
    if (!backdrop.hidden || !loader.hidden) return;
    previousFocus = document.activeElement;
    const value = String(Math.max(1,Math.min(52,Number(week)||1))).padStart(2,'0');
    document.getElementById('paywall-week').textContent = 'Semana ' + value;
    document.getElementById('protected-filename').textContent = 'Semana_' + value + '_Programacion.pdf';
    const reveal = () => { loader.hidden = true; backdrop.hidden = false; document.body.classList.add('modal-open'); close.focus(); };
    if (immediate) return reveal();
    loader.hidden = false;
    document.body.classList.add('modal-open');
    clearTimeout(timer);
    timer = setTimeout(reveal, 1280);
  }
  function dismiss() {
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  document.addEventListener('crossfit:access', e => open(e.detail?.week,e.detail?.immediate));
  ['nav-subscription','sidebar-upgrade','account-chip'].forEach(id => document.getElementById(id).addEventListener('click', () => open(Number(document.getElementById('preview-week').textContent),true)));
  close.addEventListener('click', dismiss);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) dismiss(); });
  document.addEventListener('keydown', e => {
    if (!loader.hidden && e.key === 'Escape') {
      clearTimeout(timer); loader.hidden = true; document.body.classList.remove('modal-open'); e.preventDefault();
      if (previousFocus?.isConnected) previousFocus.focus();
    }
    if (backdrop.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); dismiss(); return; }
    if (e.key !== 'Tab') return;
    const nodes = [close,action,restore].filter(b=>!b.disabled);
    const pos = nodes.indexOf(document.activeElement);
    if (e.shiftKey && pos <= 0) { e.preventDefault(); nodes[nodes.length-1].focus(); }
    if (!e.shiftKey && pos === nodes.length-1) { e.preventDefault(); nodes[0].focus(); }
  });
  window.addEventListener('pagehide',()=>clearTimeout(timer));
})();
