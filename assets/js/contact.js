
(() => {
  'use strict';
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.sending === '1' || !form.reportValidity()) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type="submit"]');
    form.dataset.sending = '1';
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form),
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!(response.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('The enquiry service is not available on this preview. Please try again once the live email service is connected.');
      }
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.message || 'Your request could not be sent. Please try again.');
      status.textContent = window.SiteConfig?.contactSuccessMessage || 'Successfully sent!';
      form.reset();
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? 'The connection timed out. Please check before sending again.'
        : error.message || 'Connection interrupted. Please try again.';
    } finally {
      clearTimeout(timeout);
      delete form.dataset.sending;
      button.disabled = false;
      button.textContent = 'Send my request';
    }
  });
})();
