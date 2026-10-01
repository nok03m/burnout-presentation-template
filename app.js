const $=s=>document.querySelector(s),S=SCREENS,ST=['Comprender','Identificar','Detectar','Actuar','Reflexionar'];
let i=0,B=30,sel=new Set(),rev=false,ck=0,ch={};const base={},ans={};
const setB=v=>{B=Math.max(0,Math.min(100,Math.round(v)));document.body.style.setProperty('--b',B);$('#bar').style.width=B+'%';$('#pct').textContent=B+'%';const m=$('.meter');m.classList.toggle('ok',B>=60);m.classList.toggle('low',B<35)};
const hd=s=>`${s.sug?'<span class="tag">Contenido sugerido</span>':''}<h2>${s.h}</h2>`;
const cards=c=>`<div class="grid">${c.map(x=>`<div class="card"><span class="ic">${x[0]}</span><b>${x[1]}</b>${x[2]}</div>`).join('')}</div>`;
const R={
cover:s=>`<div class="panel"><h1>${s.title}</h1><p>${s.sub}</p><button class="go" onclick="go(1)">Empezar</button></div>`,
info:s=>`<div class="panel">${hd(s)}<p>${s.p}</p>${cards(s.cards)}${s.note?`<div class="fb">${s.note}</div>`:''}</div>`,
multi:s=>`<div class="panel">${hd(s)}<div class="sc">${s.sc}</div><p><b>${s.q}</b> (elige todas las que apliquen; teclas 1-${s.o.length})</p><div class="grid">${s.o.map((o,k)=>`<button class="opt" data-k="${k}" aria-pressed="false">${k+1}. ${o.x}</button>`).join('')}</div><p><button id="rv" class="go">Revelar</button> <button id="rs" hidden>Reintentar</button></p><div id="fb"></div></div>`,
build:s=>`<div class="panel">${hd(s)}<div class="sc">${s.sc}</div>${s.L.map((l,a)=>`<div class="lever"><b>${l[0]}</b><div class="row">${l.slice(1).map((o,b)=>`<button class="opt" data-a="${a}" data-b="${b}" aria-pressed="false">${o[0]}</button>`).join('')}</div></div>`).join('')}<button id="rv" class="go">Ver explicación</button><div id="fb"></div></div>`,
chain:s=>`<div class="panel">${hd(s)}<div class="chain" id="ch"></div><p><button id="nx" class="go">Mostrar siguiente efecto</button> <button id="pt" hidden>Intervenir</button></p><div id="fb"></div></div>`,
end:s=>`<div class="panel"><h1>${s.h}</h1><ul class="sum">${S.map((x,k)=>x.sum&&ans[k]?`<li><b>${x.sum}:</b> ${ans[k]}</li>`:'').join('')}</ul><p>${s.p}</p><div class="fb">${s.q}</div></div>`,
src:s=>`<div class="panel">${hd(s)}<ul>${s.L.map(x=>`<li>${x}</li>`).join('')}</ul></div>`};
function draw(){const s=S[i];$('#stages').innerHTML=ST.map((t,k)=>`<span class="${k==s.st?'on':k<s.st?'done':''}">0${k+1} ${t}</span>`).join('');
$('#count').textContent=`${i+1} / ${S.length}`;$('#prev').disabled=!i;$('#next').disabled=i==S.length-1;
$('#stage').innerHTML=R[s.t](s);$('#stage').focus({preventScroll:true});scrollTo(0,0);const f=window['b_'+s.t];f&&f(s)}
function go(n){i=Math.max(0,Math.min(S.length-1,n));sel=new Set();rev=false;ck=0;ch={};draw()}
const fb=h=>$('#fb').innerHTML=`<div class="fb">${h}</div>`;
window.b_multi=s=>{const O=[...document.querySelectorAll('.opt')];
O.forEach(b=>b.onclick=()=>{if(rev)return;const k=+b.dataset.k;sel.has(k)?sel.delete(k):sel.add(k);b.setAttribute('aria-pressed',sel.has(k))});
$('#rv').onclick=()=>{if(rev)return;rev=true;base[i]??=B;let h=0,w=0,tot=s.o.filter(o=>o.ok).length;
O.forEach((b,k)=>{const o=s.o[k];if(sel.has(k))o.ok?h++:w++;b.classList.add(o.ok?'ok':'no');b.innerHTML+=`<small>${o.ok?'✔ Sí aplica':'✖ No aplica'}. ${o.w}</small>`});
setB(base[i]+s.m*Math.max(0,h-w)/tot);ans[i]=s.o.filter((o,k)=>o.ok&&(sel.has(k)||!sel.size||h==0)).map(o=>o.x).join(', ');
fb(s.end);$('#rs').hidden=false;$('#rv').hidden=true};
$('#rs').onclick=()=>{sel=new Set();rev=false;draw()}};
window.b_build=s=>{base[i]??=B;$('.panel').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ch[b.dataset.a]=+b.dataset.b;
document.querySelectorAll(`.opt[data-a="${b.dataset.a}"]`).forEach(x=>x.setAttribute('aria-pressed',x==b));
const sum=Object.entries(ch).reduce((t,[a,k])=>t+s.L[a][k+1][1],0);setB(25+(sum+5)*5);
ans[i]=Object.entries(ch).map(([a,k])=>s.L[a][0]+': '+s.L[a][k+1][0]).join('; ')});
$('#rv').onclick=()=>fb(s.end)};
window.b_chain=s=>{const add=()=>{const c=$('#ch'),x=s.steps[ck];c.innerHTML+=(ck?'<span class="arrow" aria-hidden="true">⬇</span>':'')+`<div class="card"><span class="ic">${x[0]}</span><b>${x[1]}</b>${x[2]}</div>`;ck++;
if(ck>=s.steps.length){$('#nx').hidden=true;$('#pt').hidden=false}};add();
$('#nx').onclick=add;$('#pt').onclick=()=>{base[i]??=B;setB(base[i]+12);ans[i]=s.steps.map(x=>x[1]).join(' → ');fb(s.prot);$('#pt').hidden=true}};
$('#next').onclick=()=>go(i+1);$('#prev').onclick=()=>go(i-1);
onkeydown=e=>{if(e.key=='ArrowRight')go(i+1);else if(e.key=='ArrowLeft')go(i-1);
else if(e.key=='Enter'&&e.target.tagName!='BUTTON'){const r=$('#rv');r&&!r.hidden?r.click():go(i+1)}
else if(/^[1-9]$/.test(e.key)){const o=document.querySelector(`.opt[data-k="${e.key-1}"]`);o&&o.click()}};
setB(30);draw();
