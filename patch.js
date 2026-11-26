/* Інвентаризація голосом — патч v7: сірий інтерфейс, вибір дати, таблиця останніх записів; склади, e-mail, ручне коригування; артикул + кількість без паузи; штрих-коди */
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

/* ---------- v7: стиль, дата, таблиця останніх ---------- */
(function(){var s=document.createElement('style');s.id='inv7';s.textContent=':root{--bg:light-dark(#ffffff,#121212);--ink:light-dark(#1f1f1f,#ececec);--mut:light-dark(#6b6b6b,#a3a3a3);--line:light-dark(#e2e2e2,#2e2e2e);--card:light-dark(#f4f4f4,#1c1c1c);--sky:light-dark(#4a4a4a,#262626)}header{padding:10px 0 12px}header h1{font-size:19px}.sub{margin-top:6px;font-size:13px;gap:6px}header select,header input,header button{min-height:36px;font-size:15px;padding:4px 8px}header select{background:#fff;color:#1f1f1f}#hstat{font-size:14px!important}.voice{gap:12px;padding:12px 0 6px}#mic{width:64px;height:64px;box-shadow:0 4px 12px rgba(255,122,26,.3)}#mic svg{width:28px;height:28px}.res .big{font-size:18px}body{padding-bottom:calc(20vh + 12px)}#topbar{float:right;display:flex;flex-wrap:nowrap;align-items:center;gap:5px;padding:0;margin:0 0 4px 8px}\n#topbar .hint{font-size:10px;color:rgba(255,255,255,.7);margin:0;white-space:nowrap}\n#topbar button{min-height:28px;font-size:12px;padding:2px 8px;border-radius:8px}\n#topbar #stat{display:none}\n#toast{top:10px;left:10px;right:auto;bottom:auto;transform:none;opacity:.82;max-width:80vw}\n#mq{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70;display:flex;align-items:center;justify-content:center;padding:16px}\n#mq .bx{background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:16px;max-width:420px;width:100%}\n#mq .bt{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}#recent{position:fixed;left:0;right:0;bottom:0;height:20vh;background:var(--bg);border-top:2px solid var(--line);z-index:8;overflow-y:auto;-webkit-overflow-scrolling:touch}#recent table{width:100%;max-width:760px;margin:0 auto;border-collapse:collapse;font-size:14px}#recent th{position:sticky;top:0;background:var(--card);text-align:left;font-weight:600;padding:6px 8px;font-size:12px;color:var(--mut)}#recent td{padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}#recent .q{text-align:right;white-space:nowrap;font-weight:600;font-variant-numeric:tabular-nums}#recent tr.ed td{background:#ffe066;color:#111}\n#recent tbody tr:first-child td{background:#c62828;color:#fff}#dw{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:60;display:flex;align-items:flex-end}#dw .sh{width:100%;background:var(--bg);color:var(--ink);border-radius:16px 16px 0 0;padding:10px 14px 18px}#dw .bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}#dw .cols{position:relative;display:flex;justify-content:center;gap:4px;height:200px}#dw .col{height:200px;overflow-y:scroll;scroll-snap-type:y mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:80px 0;text-align:center}#dw .col::-webkit-scrollbar{display:none}#dw .col div{height:40px;line-height:40px;scroll-snap-align:center;font-size:20px;padding:0 14px;white-space:nowrap}#dw .band{position:absolute;left:8px;right:8px;top:80px;height:40px;border-radius:10px;background:var(--card);border:1px solid var(--line);pointer-events:none;z-index:-1}#dw .cols{z-index:0}';document.head.appendChild(s)})();
var MON=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
function h(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fq(n){return String(Math.round(n*1000)/1000).replace('.',',')}
window.__inv.recent=function(entries){
  var r=document.getElementById('recent');if(!r){if(!document.body)return;r=document.createElement('div');r.id='recent';r.setAttribute('aria-label','Останні записи');document.body.appendChild(r)}
  var L=(entries||[]).slice().sort(function(a,b){return b.t-a.t}).slice(0,300);
  r.innerHTML='<table><thead><tr><th>Артикул</th><th>Назва</th><th class="q">Кількість</th></tr></thead><tbody>'+L.map(function(e){return'<tr'+(e.edited?' class="ed"':'')+'><td>'+h(e.art)+'</td><td>'+h(e.name)+'</td><td class="q">'+fq(e.bad?e.saidQty:e.qty)+' '+h(e.bad?e.said:e.unit)+'</td></tr>'}).join('')+'</tbody></table>';
  r.scrollTop=0};
function pad(n){return(n<10?'0':'')+n}
function openDate(){
  var st=window.__inv.st;if(!st||document.getElementById('dw'))return;
  var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(st.sid||''),now=new Date(),Y=m?+m[1]:now.getFullYear(),M=m?+m[2]:now.getMonth()+1,D=m?+m[3]:now.getDate(),y0=now.getFullYear()-2,ys=[];
  for(var y=y0;y<=now.getFullYear()+1;y++)ys.push(y);
  function col(id,arr){return'<div class="col" id="'+id+'">'+arr.map(function(x){return'<div>'+x+'</div>'}).join('')+'</div>'}
  var ds=[];for(var d=1;d<=31;d++)ds.push(d);
  var o=document.createElement('div');o.id='dw';
  o.innerHTML='<div class="sh" role="dialog" aria-label="Дата інвентаризації"><div class="bar"><button type="button" id="dwx">Скасувати</button><b>Дата інвентаризації</b><button type="button" id="dwok" class="primary">Готово</button></div><div class="cols"><div class="band"></div>'+col('dwd',ds)+col('dwm',MON)+col('dwy',ys)+'</div></div>';
  document.body.appendChild(o);
  function g(id){return document.getElementById(id)}
  function idx(id,n){return Math.max(0,Math.min(n-1,Math.round(g(id).scrollTop/40)))}
  g('dwd').scrollTop=(D-1)*40;g('dwm').scrollTop=(M-1)*40;g('dwy').scrollTop=Math.max(0,ys.indexOf(Y))*40;
  function close(){o.remove()}
  o.onclick=function(e){if(e.target===o)close()};g('dwx').onclick=close;
  g('dwok').onclick=function(){var y=ys[idx('dwy',ys.length)],mo=idx('dwm',12)+1,d=idx('dwd',31)+1,mx=new Date(y,mo,0).getDate();if(d>mx)d=mx;
    var s=y+'-'+pad(mo)+'-'+pad(d);close();if(s===st.sid)return;var moved=st.redate(s);st.toast(moved?'Дату інвентаризації змінено: '+pad(d)+'.'+pad(mo)+'.'+y:'Відкрито інвентаризацію за '+pad(d)+'.'+pad(mo)+'.'+y)}}
window.__inv.openDate=openDate;
window.__inv.multi=function(f,api){
  var L=[];Array.prototype.forEach.call(document.querySelectorAll('#list form.qin'),function(x){var i=x.querySelector('input'),v=parseFloat(String(i.value).replace(',','.'));if(i.value.trim()!==''&&v>=0)L.push({art:x.dataset.a,v:v,cur:x===f})});
  if(L.length<2||document.getElementById('mq'))return false;
  var st=window.__inv.st,o=document.createElement('div');o.id='mq';
  o.innerHTML='<div class="bx" role="dialog" aria-label="Кілька значень"><b>Додати одразу кілька значень?</b><div class="hint">Заповнено позицій: '+L.length+'</div><div class="bt"><button type="button" id="mqx">Скасувати</button><button type="button" id="mq1">Лише цю</button><button type="button" id="mqok" class="primary">OK</button></div></div>';
  document.body.appendChild(o);
  function add(list){o.remove();(async function(){var n=0;for(var k=0;k<list.length;k++){var a=api.ARTS.filter(function(x){return x.art===list[k].art})[0];if(!a)continue;await api.commit(a,{qty:list[k].v,unit:a.unit,text:'вручну'},null);n++}if(n>1&&st)st.toast('Додано позицій: '+n)})()}
  document.getElementById('mqx').onclick=function(){o.remove()};
  document.getElementById('mq1').onclick=function(){add(L.filter(function(x){return x.cur}))};
  document.getElementById('mqok').onclick=function(){add(L)};
  return true};

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
  var ft=document.querySelector('.foot'),hw=document.querySelector('header .wrap');
  if(ft&&hw&&ft.parentNode!==hw){
    var mbx=document.getElementById('mailbox');if(mbx){var f2=document.createElement('div');f2.style.cssText='display:flex;padding:14px 0 20px';ft.parentNode.insertBefore(f2,ft);f2.appendChild(mbx)}
    hw.insertBefore(ft,hw.firstChild);ft.id='topbar';
    var vh=ft.querySelector('.hint');if(vh){vh.style.cssText='';vh.textContent=vh.textContent.replace(/Версія\s*(\d+).*/,'v$1')}
    var ex=document.getElementById('exp'),cp=document.getElementById('copy');
    if(ex){ex.setAttribute('aria-label','Надіслати або зберегти файл CSV');ex.textContent='CSV';ex.className='hbtn'}
    if(cp){cp.setAttribute('aria-label','Копіювати таблицею');cp.textContent='Копіювати';cp.className='hbtn'}}
  var db=document.getElementById('dateB');if(db&&!db.onclick)db.onclick=openDate;
  if(!document.getElementById('recent'))window.__inv.recent(window.__inv.st?window.__inv.st.entries:[]);
  var mb=document.getElementById('mailb');if(mb&&!mb.onclick)mb.onclick=function(){window.__inv.send()};
  var z=document.getElementById('zones');if(!z||document.getElementById('scanb'))return;
  var b=document.createElement('button');b.type='button';b.id='scanb';b.className='primary';b.style.cssText='width:100%;margin:10px 0 2px;min-height:52px;font-size:17px;border-radius:12px';
  b.textContent='Сканувати штрих-код';b.onclick=openScan;z.parentNode.insertBefore(b,z)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addBtn);else addBtn();
window.addEventListener('load',addBtn);
})();
