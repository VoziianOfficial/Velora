
(() => {
 'use strict';
 document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', e => { if (!e.target.closest('a,button')) card.classList.toggle('is-flipped'); });
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-flipped'); } });
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
