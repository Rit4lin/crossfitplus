(() => {
  'use strict';
  const button = document.getElementById('subscribe');
  const restore = document.getElementById('restore');
  const toast = document.getElementById('toast');
  let timeout;
  let request;
  function notice(message) {
    clearTimeout(timeout);
    toast.textContent = message;
    toast.hidden = false;
    timeout = setTimeout(() => {toast.hidden = true;},4200);
  }
  button.addEventListener('click', () => {
    if (button.disabled) return;
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Procesando solicitud...';
    clearTimeout(request);
    request = setTimeout(() => {
      button.disabled = false;
      button.innerHTML = original;
      notice('El servicio de suscripciones no está disponible en este momento. Inténtalo de nuevo más tarde.');
    },1200);
  });
  restore.addEventListener('click', () => notice('No se han encontrado compras anteriores asociadas a este dispositivo.'));
  window.addEventListener('pagehide',() => {clearTimeout(request);clearTimeout(timeout);});
})();
