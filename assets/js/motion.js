/* Stable typography, compositor-only motion and container-bound carousels. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = preference.matches;

  if (window.AOS) AOS.init({ once: true, duration: 550, offset: 40, disable: reduce });
  else document.querySelectorAll('[data-aos]').forEach(element => element.removeAttribute('data-aos'));

  const typedHeadings = new Map();
  const headingObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) { headingObserver.unobserve(entry.target); typedHeadings.get(entry.target)?.(); } });
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll('[data-type-heading]').forEach(heading => {
    if (reduce) return;
    const accessibleText = heading.innerHTML.replace(/<br\s*\/?>/gi, ' ');
    const textHolder = document.createElement('span'); textHolder.innerHTML = accessibleText;
    heading.setAttribute('aria-label', textHolder.textContent);
    const lines = heading.innerHTML.split(/<br\s*\/?>/i);
    const content = document.createElement('span'); content.setAttribute('aria-hidden','true');
    const characters=[];
    lines.forEach((line,index)=>{
      if(index) content.append(document.createElement('br'));
      const text=document.createElement('span');text.innerHTML=line;
      text.textContent.split(/(\s+)/).forEach(word=>{
        if(/^\s+$/.test(word)){content.append(document.createTextNode(word));return;}
        const group=document.createElement('span');group.className='type-word';
        [...word].forEach(character=>{const span=document.createElement('span');span.className='type-char';span.textContent=character;group.append(span);characters.push(span);});content.append(group);
      });
    });
    heading.replaceChildren(content);heading.classList.add('typing-ready');
    let started=false,startTime,lastVisible=0;
    function frame(now){
      if(startTime===undefined)startTime=now;
      const visible=preference.matches?characters.length:Math.min(characters.length,Math.floor((now-startTime)/25)+1);
      for(let i=lastVisible;i<visible;i++)characters[i].classList.add('shown');lastVisible=visible;
      if(visible<characters.length)requestAnimationFrame(frame);else {heading.classList.remove('typing-ready');typedHeadings.delete(heading);}
    }
    const start=()=>{if(started)return;started=true;requestAnimationFrame(frame);};typedHeadings.set(heading,start);
    if(headingObserver)headingObserver.observe(heading);else start();
  });
  preference.addEventListener('change',event=>{if(event.matches)document.querySelectorAll('.typing-ready').forEach(h=>h.classList.remove('typing-ready'));});

  if (window.Swiper) {
    document.querySelectorAll('.swiper').forEach(element => {
      new Swiper(element, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        speed: reduce ? 0 : 500,
        touchStartPreventDefault: false,
        passiveListeners: true,
        touchAngle: 35,
        threshold: 8,
        grabCursor: true,
        a11y: { enabled: true },
        navigation: { prevEl: element.nextElementSibling.querySelector('.prev'), nextEl: element.nextElementSibling.querySelector('.next') },
        breakpoints: {
          600: { slidesPerView: 2, spaceBetween: 24 },
          1100: { slidesPerView: 3, spaceBetween: 28 }
        }
      });
    });
  }

  document.querySelectorAll('.material-tabs').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    function activate(tab) {
      tabs.forEach(item => {
        const on = item === tab;
        item.setAttribute('aria-selected', String(on));
        item.tabIndex = on ? 0 : -1;
        root.querySelector('[data-panel="' + item.dataset.tab + '"]').hidden = !on;
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') activate(tab);
      });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(tabs[next]); tabs[next].focus(); }
      });
    });
  });

  const back = document.querySelector('.back-top');
  const photos = [...document.querySelectorAll('.parallax-img, .hero-background')];
  const visiblePhotos = new Set(photos);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) visiblePhotos.add(entry.target);
      else visiblePhotos.delete(entry.target);
    }), { rootMargin: '100px' });
    photos.forEach(photo => observer.observe(photo));
  }
  let ticking = false;
  function updateScroll() {
    back.classList.toggle('visible', scrollY > 600);
    if (!preference.matches && matchMedia('(pointer: fine)').matches) {
      const updates = [];
      visiblePhotos.forEach(photo => {
        const bounds = photo.parentElement.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
        const progress = (innerHeight - bounds.top) / (innerHeight + bounds.height);
        updates.push([photo, -progress * bounds.height * .075]);
      });
      updates.forEach(([photo, offset]) => { photo.style.transform = 'translate3d(0,' + offset + 'px,0)'; });
    }
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();
  back.addEventListener('click', () => scrollTo({ top: 0, behavior: preference.matches ? 'instant' : 'smooth' }));

  // Stop decorative motion when it cannot be seen.
  const hero = document.querySelector('.photo-hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
    }).observe(hero);
  }
})();
