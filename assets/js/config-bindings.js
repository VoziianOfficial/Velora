/* One brand configuration across every page. */
(() => {
  'use strict';
  const config = window.SiteConfig || {};
  const expand = value => String(value ?? '')
    .replaceAll('{companyName}', config.companyName || '')
    .replaceAll('{year}', String(new Date().getFullYear()));

  document.querySelectorAll('[data-config]').forEach(element => {
    const key = element.dataset.config;
    if (config[key] === undefined) return;
    if (element.tagName === 'IMG') element.src = expand(config[key]);
    else element.textContent = expand(config[key]);
  });
  document.querySelectorAll('[data-email]').forEach(element => {
    element.textContent = config.email || '';
    element.href = 'mailto:' + (config.email || '');
  });
  document.title = expand(config.pageTitles?.[document.body.dataset.page] || config.browserTitle);
  if (config.favicon) document.querySelector('link[rel="icon"]').href = config.favicon;
})();
