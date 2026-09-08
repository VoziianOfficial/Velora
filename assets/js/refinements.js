
(() => {
 'use strict';
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', e => { if (!e.target.closest('a,button')) card.classList.toggle('is-flipped'); });
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-flipped'); } });
 });
 document.querySelectorAll('.accordion details').forEach(detail => {
  const summary = detail.querySelector('summary');
  const content = summary?.nextElementSibling;
  if (!summary || !content) return;
  let animation;
  const finish = open => {
   detail.open = open;
   detail.classList.remove('is-opening', 'is-closing', 'is-fading');
   detail.style.height = '';
   detail.style.overflow = '';
   animation = null;
  };
  const toggle = open => {
   if (reducedMotion.matches) return finish(open);
   if (animation) {
    animation.oncancel = null;
    animation.cancel();
   }
   const startHeight = `${detail.offsetHeight}px`;
   if (open) detail.open = true;
   detail.classList.toggle('is-opening', open);
   detail.classList.toggle('is-closing', !open);
   detail.classList.remove('is-fading');
   const endHeight = open ? `${summary.offsetHeight + content.offsetHeight}px` : `${summary.offsetHeight}px`;
   detail.style.height = startHeight;
   detail.style.overflow = 'hidden';
   if (!open) requestAnimationFrame(() => detail.classList.add('is-fading'));
   animation = detail.animate({ height: [startHeight, endHeight] }, {
    duration: open ? 380 : 280,
    easing: 'cubic-bezier(.22, 1, .36, 1)'
   });
   animation.onfinish = () => finish(open);
   animation.oncancel = () => finish(detail.open);
  };
  summary.addEventListener('click', event => {
   event.preventDefault();
   const nextOpen = !detail.open;
   if (nextOpen && detail.closest('.tactile-faq')) {
    detail.closest('.accordion')?.querySelectorAll('details[open]').forEach(item => {
     if (item !== detail) item.dispatchEvent(new Event('accordion:close'));
    });
   }
   toggle(nextOpen);
  });
  detail.addEventListener('accordion:close', () => {
   if (detail.open) toggle(false);
  });
 });
 document.querySelectorAll('.reason-grid article').forEach(card => {
  const toggle=()=>card.classList.toggle('is-active');
  card.addEventListener('click',toggle);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
 });
 document.querySelectorAll('.reviews-section').forEach(section => {
  const marquee=section.querySelector('.review-marquee'), button=section.querySelector('.review-toggle');
  button.addEventListener('click',()=>{ const paused=marquee.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Play reviews':'Pause reviews'; });
 });
 if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.querySelectorAll('.ambient-svg g,.legal-cleaning,.review-track,.section-prop,.contact-extractor').forEach(el=>{el.style.animationPlayState=entry.isIntersecting?'':'paused';});
  }),{rootMargin:'120px'});
  document.querySelectorAll('.section').forEach(el=>observer.observe(el));
 }
})();

(() => {
 const section=document.querySelector('.pricing-section');if(!section)return;
 let rhythm='once';
 section.querySelectorAll('[data-rhythm]').forEach(button=>button.addEventListener('click',()=>{
  rhythm=button.dataset.rhythm;
  section.querySelectorAll('[data-rhythm]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  section.querySelectorAll('[data-plan-timing]').forEach(e=>e.textContent=rhythm==='once'?'One agreed appointment':'A schedule agreed with you');
  section.querySelectorAll('.plan-choose').forEach(e=>e.textContent=rhythm==='once'?'Plan this clean':'Plan regular care');
 }));
 section.querySelectorAll('.plan-choose').forEach(link=>link.addEventListener('click',()=>{
  const card=link.closest('.plan-card');section.querySelectorAll('.plan-card').forEach(c=>c.classList.toggle('is-selected',c===card));
  const form=document.querySelector('#contact form');if(!form)return;
  form.elements.service.value=card.dataset.planService;
  const message=form.elements.message;
  if(!message.value.trim()||message.dataset.planPrefill===message.value){message.value=`I’m interested in ${card.dataset.planName.toLowerCase()} with ${rhythm==='once'?'a one-off clean':'regular care'}. Please help me discuss the scope and a quote.`;message.dataset.planPrefill=message.value;}
 }));
})();
