/* Інвентаризація голосом — патч v6: склади, e-mail, ручне коригування; артикул + кількість без паузи; штрих-коди */
(function(){
var DIG={'нуль':0,'ноль':0,'один':1,'одна':1,'раз':1,'два':2,'дві':2,'три':3,'чотири':4,'четыре':4,'пять':5,'шість':6,'шесть':6,'сім':7,'семь':7,'вісім':8,'восемь':8,'девять':9};
var byKey=null;
var BC={},PF={};
(window.__BCS||'').split(';').forEach(function(x){var i=x.indexOf(':');if(i<0)return;var a=x.slice(0,i);x.slice(i+1).split(',').forEach(function(c){BC[c]=a})});
(window.__PFS||'').split(';').forEach(function(x){var i=x.indexOf(':');if(i>0)PF[x.slice(i+1)]=x.slice(0,i)});
var WH=[{c:'k',n:'Кулінарія виробництво',f:'Kulinaria',s:'Кулинария Межигорская'},{c:'m',n:'М’ясо виробництво',f:'Miaso',s:'М’ясний цех, Межигірська, 82'},{c:'r',n:'Риба виробництво',f:'Ryba',s:'Рыба М82 сырье'}];
var wh='k';try{var w0=localStorage.getItem('inv:wh');if(w0&&WH.some(function(x){return x.c===w0}))wh=w0}catch(e){}
var KIND={'с':'с','н':'нф','г':'гп'},YEL='background:#ffe066;color:#111;border-radius:6px;';
function find(api,code){if(!byKey){byKey=new Map();api.ARTS.forEach(function(a){byKey.set(a.key,a)})}return byKey.get(code)}
function artPrefix(text,api){
  var tk=String(text).toLowerCase().replace(/[’ʼ']/g,'').trim().split(/\s+/),i=0,code='';
  while(i<tk.length&&code.length<5){
    var w=tk[i].replace(/^[.,;:]+|[.,;:]+$/g,'');
    if(w==='артикул'||w==='номер'){i++;continue}
    if(w in DIG){code+=DIG[w];i++;continue}
    if(code===''&&/^[a-zа-яіїєґ]\d{4}$/.test(w)){code=w;i++;break}
    if(/^[\d.,]+$/.test(w)&&/\d/.test(w)){
      var need=5-code.length,k=0,n=0;
      while(k<w.length&&n<need){if(/\d/.test(w[k]))n++;k++}
      code+=w.slice(0,k).replace(/[.,]/g,'');
      var rest=w.slice(k).replace(/^[.,]+/,'');
      if(rest){tk[i]=rest;break}
      i++;continue}
    break}
  if(code.length!==5)return null;
  var a=find(api,code),tail=tk.slice(i).join(' ');
  if(!a)return (/^\d{5}$/.test(code)&&tail)?{missing:code}:null;
  return {a:a,rest:tail}}
function qtyAfter(a,rest,full,api){
  var p=api.parsePhrase(rest);p.text=full;
  var ws=api.norm(rest).split(' ').filter(Boolean),nums=ws.filter(function(w){return /^\d+$/.test(w)});
  if(ws.length>=2&&/^\d+$/.test(ws[0])&&/^\d{3}$/.test(ws[1])&&nums.length===2&&(p.unit==='кг'||(!p.unit&&a.unit==='кг')))p.qty=parseInt(ws[0],10)+parseInt(ws[1],10)/1000;
  return p}
function card(api,html){api.$('result').innerHTML='<div class="res">'+html+'</div>'}
window.__inv={pending:null,YEL:YEL,
  arts:function(){var out=[];(window.__CAT||'').split('\n').forEach(function(l){var f=l.split('|');if(f.length<4)return;var i=f[3].indexOf(wh);if(i<0)return;out.push({art:f[0],name:f[1],unit:f[2],kind:KIND[f[3].charAt(i+1)]||'с'})});return out},
  key:function(k){return(wh==='k'||k==='inv:who'||k==='inv:mailto')?k:k.replace(/^inv:/,'inv:'+wh+':')},
  whCode:function(){return WH.filter(function(x){return x.c===wh})[0].f},
  whName:function(){var x=WH.filter(function(x){return x.c===wh})[0];return x.n+' ('+x.s+')'},
  pool:function(A,v){if(v==='all')return A;if(v==='нф'||v==='с')return A.filter(function(a){return a.kind===v});return A.filter(function(a){return a.kind!=='гп'})},
  edit:function(id,btn){
    var st=this.st;if(!st)return;var e=st.entries.filter(function(x){return x.id===id})[0];if(!e)return;
    var row=btn.parentNode;row.innerHTML='<input inputmode="decimal" autocomplete="off" style="width:110px;text-align:right" aria-label="Нова кількість, '+e.unit+'"><button type="button" class="del">Зберегти</button>';
    var inp=row.querySelector('input'),ok=row.querySelector('button');inp.value=String(e.bad?e.saidQty:e.qty).replace('.',',');
    inp.onclick=function(ev){ev.stopPropagation()};
    function save(ev){ev.stopPropagation();var v=parseFloat(inp.value.replace(',','.'));if(!(v>=0))return;if(e.orig==null)e.orig=e.bad?e.saidQty:e.qty;if(v===e.qty&&!e.bad){st.save();return}e.qty=v;e.bad=false;e.said=e.unit;e.edited=true;st.save();st.toast(e.name+': виправлено на '+String(v).replace('.',',')+' '+e.unit)}
    ok.onclick=save;inp.onkeydown=function(ev){if(ev.key==='Enter'){ev.preventDefault();save(ev)}};
    try{inp.focus();inp.select()}catch(x){}},
  mail:function(){var st=this.st,b=document.getElementById('mailbox');if(!b||!st)return;var on=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(st.me);b.style.display=on?'flex':'none';
    var t=document.getElementById('mailto');if(on&&!t.value){try{t.value=JSON.parse(localStorage.getItem('inv:mailto'))||''}catch(e){}}},
  send:function(){var st=this.st,t=document.getElementById('mailto'),to=(t.value||'').trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)){st.toast('Вкажіть e-mail одержувача');try{t.focus()}catch(e){}return}
    try{localStorage.setItem('inv:mailto',JSON.stringify(to))}catch(e){}
    var T=st.totals(),rows=[],n=0;st.ARTS.forEach(function(a){var x=T.get(a.art);if(!x||(!x.q&&!x.bad.length))return;n++;rows.push(a.art+'; '+a.name+'; '+String(Math.round(x.q*1000)/1000).replace('.',',')+' '+a.unit+(x.list.some(function(e){return e.edited})?'; скориговано вручну':''))});
    if(!n){st.toast('Ще нічого не внесено');return}
    var subj='Інвентаризація '+this.whName()+' '+(st.sid||''),body='Склад: '+this.whName()+'\nІнвентаризація: '+(st.sid||'')+'\nРахував: '+st.me+'\nПозицій: '+n+'\n\nАртикул; Назва; Кількість\n'+rows.join('\n')+'\n';
    var url='mailto:'+encodeURIComponent(to)+'?cc='+encodeURIComponent(st.me)+'&subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
    if(url.length>30000){url='mailto:'+encodeURIComponent(to)+'?cc='+encodeURIComponent(st.me)+'&subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent('Склад: '+this.whName()+'\nПозицій: '+n+'\nТаблиця у вкладенні (CSV) — прикріпіть файл, який щойно збережено.\n');document.getElementById('exp').click()}
    location.href=url},
  pre:async function(part,api){
    var bc=String(part).replace(/\s+/g,'');
    if(/^\d{8,14}$/.test(bc)){this.scanned(bc,api);return true}
    var pre=artPrefix(part,api);if(!pre)return false;
    if(pre.missing){card(api,'<span class="warn">Артикул '+api.esc(pre.missing)+' не знайдено в довіднику.</span> «'+api.esc(part)+'»');return true}
    var p=qtyAfter(pre.a,pre.rest,part,api);
    if(p.qty==null){this.pending=pre.a;card(api,'<div class="big">'+api.esc(pre.a.name)+'</div><div>'+api.esc(pre.a.art)+' · назвіть кількість</div>');return true}
    this.pending=null;await api.commit(pre.a,p,null);return true},
  bare:async function(p,api){if(this.pending&&p.qty!=null){var a=this.pending;this.pending=null;await api.commit(a,p,null)}},
  ready:function(part,api){
    if(/^\d{8,14}$/.test(String(part).replace(/\s+/g,'')))return true;
    var pre=artPrefix(part,api);
    if(pre&&pre.a)return qtyAfter(pre.a,pre.rest,part,api).qty!=null;
    var p=api.parsePhrase(part);return p.qty!=null&&(p.nameWs.length>0||!!this.pending)},
  scanned:function(code,api){
    api=api||this.api;if(!api)return;
    var art=BC[code]||BC[code.replace(/^0+/,'')]||BC['0'+code],wq=null;
    if(!art&&code.length===13&&PF[code.slice(0,7)]){art=PF[code.slice(0,7)];wq=parseInt(code.slice(7,12),10)/1000}
    if(!art&&PF[code])art=PF[code];
    var a=art&&find(api,String(art).toLowerCase()),self=this;
    if(!a){this.pending=null;card(api,'<span class="warn">Штрих-код '+api.esc(code)+' не знайдено в довіднику.</span> Назвіть артикул або назву і кількість.');return}
    this.pending=a;
    card(api,'<div class="big">'+api.esc(a.name)+'</div><div>'+api.esc(a.art)+' · штрих-код '+api.esc(code)+'</div><form class="say" id="scq" style="margin-top:8px"><input id="scqi" inputmode="decimal" autocomplete="off" placeholder="Кількість, '+api.esc(a.unit)+'" aria-label="Кількість, '+api.esc(a.unit)+'"><button type="submit">Додати</button></form><p class="hint">Введіть кількість або скажіть її голосом: «3,5 кілограма».</p>');
    var f=document.getElementById('scq'),inp=document.getElementById('scqi');
    f.onsubmit=function(e){e.preventDefault();var v=parseFloat(inp.value.replace(',','.'));if(!(v>=0))return;self.pending=null;api.commit(a,{qty:v,unit:a.unit,text:'ШК '+code},null)};
    if(wq&&a.unit==='кг'){inp.value=String(wq).replace('.',',');document.querySelector('#scq+.hint').textContent='Вага з етикетки: '+inp.value+' кг. Натисніть «Додати» або виправте.'}
    try{inp.focus()}catch(e){}}
};
/* ---------- сканер камери ---------- */
var LIB='https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js',libP=null,scanner=null;
function lib(){if(window.Html5Qrcode)return Promise.resolve();if(!libP)libP=new Promise(function(ok,no){var s=document.createElement('script');s.src=LIB;s.onload=ok;s.onerror=function(){libP=null;no(new Error('не вдалося завантажити сканер — перевірте інтернет'))};document.head.appendChild(s)});return libP}
function closeScan(){var o=document.getElementById('scanov');var s=scanner;scanner=null;function rm(){if(o)o.remove()}if(s){s.stop().then(function(){try{s.clear()}catch(e){}rm()},rm)}else rm()}
function openScan(){
  if(document.getElementById('scanov'))return;
  var o=document.createElement('div');o.id='scanov';o.style.cssText='position:fixed;inset:0;background:#000;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:12px';
  o.innerHTML='<div id="scanbox" style="width:min(96vw,520px)"></div><div id="scanmsg" style="color:#fff;font:16px system-ui;text-align:center">Наведіть камеру на штрих-код</div><button type="button" id="scanx" style="min-height:48px;padding:8px 28px;font-size:17px;border-radius:12px">Закрити</button>';
  document.body.appendChild(o);document.getElementById('scanx').onclick=closeScan;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){document.getElementById('scanmsg').textContent='Камера недоступна в цьому браузері. Відкрийте сторінку в Safari або Chrome.';return}
  lib().then(function(){
    if(!document.getElementById('scanov'))return;
    var F=window.Html5QrcodeSupportedFormats;
    scanner=new window.Html5Qrcode('scanbox',{formatsToSupport:[F.EAN_13,F.EAN_8,F.CODE_128,F.UPC_A,F.UPC_E,F.ITF,F.CODE_39],verbose:false});
    return scanner.start({facingMode:'environment'},{fps:12,qrbox:function(w,h){return{width:Math.floor(w*0.86),height:Math.floor(Math.min(h*0.5,w*0.45))}}},function(text){
      if(!/^\d{8,14}$/.test(text))return;
      try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}
      closeScan();window.__inv.scanned(text)},function(){})
  }).catch(function(e){var m=document.getElementById('scanmsg');if(m)m.textContent='Камера не запустилась: '+String(e&&(e.message||e.name)||e)+'. Дозвольте доступ до камери для цієї сторінки.'})}
function addBtn(){
  var s=document.getElementById('wh');
  if(s&&!s.options.length){WH.forEach(function(x){var o=document.createElement('option');o.value=x.c;o.textContent=x.n;s.appendChild(o)});s.value=wh;
    s.onchange=function(){try{localStorage.setItem('inv:wh',s.value)}catch(e){}location.reload()};
    var d=document.getElementById('whs');if(d)d.textContent='Склад у 1С: '+WH.filter(function(x){return x.c===wh})[0].s}
  var mb=document.getElementById('mailb');if(mb&&!mb.onclick)mb.onclick=function(){window.__inv.send()};
  var z=document.getElementById('zones');if(!z||document.getElementById('scanb'))return;
  var b=document.createElement('button');b.type='button';b.id='scanb';b.className='primary';b.style.cssText='width:100%;margin:10px 0 2px;min-height:52px;font-size:17px;border-radius:12px';
  b.textContent='Сканувати штрих-код';b.onclick=openScan;z.parentNode.insertBefore(b,z)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addBtn);else addBtn();
window.addEventListener('load',addBtn);
})();
