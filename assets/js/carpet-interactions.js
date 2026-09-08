
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.rug-selector').forEach(root => {
    const tabs = [...root.querySelectorAll('[data-rug]')];
    const panels = [...root.querySelectorAll('.rug-panel')];
    let request = 0;
    async function show(index) {
      const ticket = ++request;
      const image = panels[index].querySelector('img');
      try { await image.decode(); } catch {  }
      if (ticket !== request || !image.naturalWidth) return;
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].classList.toggle('is-active', i === index);
        panels[i].setAttribute('aria-hidden', String(i !== index));
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') show(index); });
      tab.addEventListener('click', () => show(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); tabs[next].focus(); show(next); }
      });
    });

    const preload = () => panels.forEach(panel => {
      const image = panel.querySelector('img');
      image.loading = 'eager';
      image.decode().catch(() => {});
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { preload(); observer.disconnect(); }
      }, { rootMargin: '500px' });
      observer.observe(root);
    } else preload();
  });

  document.querySelectorAll('.comparison-layout').forEach(root => {
    const sample = root.querySelector('.woven-comparison');
    let timer;
    function setView(after) {
      sample.classList.toggle('is-after', after);
      sample.querySelector('.sample-tag').textContent = after ? 'After' : 'Before';
      sample.setAttribute('aria-label', 'Illustrative carpet comparison, showing the ' + (after ? 'after' : 'before') + ' side');
      root.querySelectorAll('[data-compare]').forEach(button => {
        button.setAttribute('aria-pressed', String((button.dataset.compare === 'after') === after));
      });
    }
    root.querySelectorAll('[data-compare]').forEach(button => {
      button.addEventListener('click', () => { clearTimeout(timer); setView(button.dataset.compare === 'after'); });
      button.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse') { clearTimeout(timer); setView(button.dataset.compare === 'after'); } });
      button.addEventListener('focus', () => { clearTimeout(timer); setView(button.dataset.compare === 'after'); });
    });
    root.querySelector('.compare-play').addEventListener('click', () => {
      clearTimeout(timer);
      if (reduced.matches) return setView(true);
      setView(false);
      timer = setTimeout(() => setView(true), 1050);
    });
  });

  document.querySelectorAll('.wash-layout').forEach(root => {
    const stage = root.querySelector('.wash-stage');
    const button = root.querySelector('.wash-toggle');
    let hovering = false, demo = false, frame = 0, x = 0, y = 0;
    function apply() {
      stage.classList.toggle('is-washing', hovering || demo);
      stage.classList.toggle('is-demo', demo);
      button.setAttribute('aria-pressed', String(demo));
      button.textContent = demo ? 'Pause the cleaning motion' : 'Show the cleaning motion';
    }
    stage.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovering = true;
      const rect = stage.getBoundingClientRect();
      x = event.clientX - rect.left; y = event.clientY - rect.top;
      stage.style.setProperty('--wash-x', x + 'px');
      stage.style.setProperty('--wash-y', y + 'px');
      apply();
    });
    stage.addEventListener('pointerleave', () => { hovering = false; apply(); });
    stage.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || demo) return;
      x = event.clientX; y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        stage.style.setProperty('--wash-x', (x - rect.left) + 'px');
        stage.style.setProperty('--wash-y', (y - rect.top) + 'px');
        frame = 0;
      });
    });
    button.addEventListener('click', () => { demo = !demo; apply(); });
    stage.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); demo = !demo; apply(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) { hovering = false; demo = false; apply(); }
      })).observe(stage);
    }
  });
})();
