const q=(s,c=document)=>c.querySelector(s);
const qa=(s,c=document)=>[...c.querySelectorAll(s)];

async function getContent(){
  const isEn=document.documentElement.lang==="en";
  const path=isEn?"../assets/data/site-content.json":"assets/data/site-content.json";
  const r=await fetch(path);
  if(!r.ok) throw new Error("No se pudo cargar el contenido");
  return r.json();
}
function renderList(el,items,template){
  if(el) el.innerHTML=items.map(template).join("");
}
function initMenu(){
  const btn=q(".menu-toggle"), menu=q(".nav-links");
  if(!btn||!menu)return;
  btn.addEventListener("click",()=>{menu.classList.toggle("open");btn.setAttribute("aria-expanded",menu.classList.contains("open"))});
  qa(".nav-links a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("open")));
}
function initReveal(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});
  qa(".reveal").forEach(el=>io.observe(el));
}
function setYear(){qa("[data-year]").forEach(el=>el.textContent=new Date().getFullYear())}
function initForms(){
  qa("form").forEach(form=>form.addEventListener("submit",()=>{
    const btn=q("button[type=submit]",form);
    if(btn){btn.disabled=true;btn.textContent=document.documentElement.lang==="en"?"Sending...":"Enviando...";}
  }));
}
async function init(){
  initMenu();initReveal();setYear();initForms();
  try{
    const c=await getContent(), en=document.documentElement.lang==="en";
    const services=en?c.serviceTimesEn:c.serviceTimes;
    const announcements=en?c.announcementsEn:c.announcements;
    const ministries=en?c.ministriesEn:c.ministries;
    renderList(q("[data-services]"),services,x=>`<div class="service-row"><div><strong>${x.day}</strong><span>${x.label}</span></div><strong>${x.time}</strong></div>`);
    renderList(q("[data-announcements]"),announcements,x=>`<article class="card reveal"><span class="announcement-date">${x.date}</span><h3>${x.title}</h3><p>${x.description}</p><a class="text-link" href="${x.link}">${x.linkText}</a></article>`);
    renderList(q("[data-ministries]"),ministries,x=>`<article class="card ministry-card reveal"><div class="ministry-icon">${x.icon}</div><h3>${x.title}</h3><p>${x.description}</p></article>`);
    initReveal();
  }catch(err){console.error(err)}
}
document.addEventListener("DOMContentLoaded",init);