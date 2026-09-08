
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const services = document.querySelector('.nav-services');
  const serviceButton = services.querySelector('button');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  serviceButton.addEventListener('click', () => {
    const open = services.classList.toggle('open');
    serviceButton.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const wasOpen = document.body.classList.contains('menu-open');
      closeMenu();
      services.classList.remove('open');
      serviceButton.setAttribute('aria-expanded', 'false');
      if (wasOpen) toggle.focus();
    }
    if (event.key === 'Tab' && document.body.classList.contains('menu-open')) {
      const items = [...nav.querySelectorAll('a, button'), toggle];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const banner = document.querySelector('.cookie-card');
  const storageKey = 'velora-cookie-consent';
  try { banner.hidden = Boolean(localStorage.getItem(storageKey)); }
  catch { banner.hidden = false; }
  document.querySelectorAll('[data-consent]').forEach(button => {
    button.addEventListener('click', () => {
      try { localStorage.setItem(storageKey, JSON.stringify({ choice: button.dataset.consent, time: Date.now() })); }
      catch {  }
      banner.hidden = true;
    });
  });
  document.querySelector('[data-cookie-settings]').addEventListener('click', () => {
    banner.hidden = false;
    banner.querySelector('button').focus();
  });

  const curtain = document.querySelector('.page-transition');
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', event => {
      if (reducedMotion || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.endsWith('.html') || (url.pathname === location.pathname && url.hash)) return;
      event.preventDefault();
      closeMenu();
      curtain.classList.add('active');
      setTimeout(() => location.assign(url.href), 420);
    });
  });
  addEventListener('pageshow', () => curtain.classList.remove('active'));
})();
