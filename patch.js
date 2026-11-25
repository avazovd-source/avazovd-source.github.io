/* Інвентаризація голосом — патч v5: артикул (5 знаків) + кількість без паузи; сканування штрих-кодів */
(function(){
var DIG={'нуль':0,'ноль':0,'один':1,'одна':1,'раз':1,'два':2,'дві':2,'три':3,'чотири':4,'четыре':4,'пять':5,'шість':6,'шесть':6,'сім':7,'семь':7,'вісім':8,'восемь':8,'девять':9};
var byKey=null;
var BC={"8421150647105":"15982","2021001125897":"S1372","2021001125880":"D0906","5060199510686":"D0906","8718963475071":"D0906","8718963486046":"D0906","2162295622959":"62295","7610632002001":"62295","8436002746394":"62295","8436008522152":"62295","8436575112121":"62295","8436593110024":"62295","2164648646483":"64648","2164636646365":"64636","2166425664253":"66425","2184960849607":"84960","4014071051133":"49087","4014071728530":"49087","4014071728547":"49087","4014071728554":"49087","4014071728561":"49087","5050372116002":"49087","5050372130251":"49087","5050372130503":"49087","5099400002368":"49087","5099400002375":"49087","5099400008698":"49087","5099400009657":"49087","643126972099":"49087","7441019900005":"49087","7441029615043":"49087","7441029615050":"49087","7441029615067":"49087","7441029615074":"49087","7441029616781":"49087","7441029616798":"49087","7443005940170":"49087","7443005940187":"49087","7443005940194":"49087","7443033890164":"49087","7443033890171":"49087","8422837155883":"49087","8430631610590":"49087","8432175145439":"49087","8435409303612":"49087","8717953151391":"49087","8718836410079":"49087","8007760000365":"18570","3760063325546":"R3917","2999405000501":"99405","039978035356":"39802","4820153600706":"D0579","4820006011468":"87050","4820153600737":"S8378","2154312543125":"54312","2185592855929":"85592","4024297015284":"20744","2196084960847":"96084","2196085960853":"96085","2021000121418":"R5545","2194720947207":"94720","2021000169113":"T4089","2021001118073":"F2924","2189942899427":"89942","42341673":"47000","4260183213079":"T1655","2154340543401":"54340","80044062":"07593","2167946679467":"67946","2170606706069":"70606","4820153600010":"62159","8000146610011":"10859","8421401203074":"G0367","8720168016508":"Q2693","2171293712937":"71293","3563490017035":"D5718","3230140002221":"09586","3563490017240":"D5733","3230140002511":"50847","3230140002573":"50820","2170966709663":"70966","2152782527829":"52782","8014531201739":"07364","2107364073645":"07364","8003240060416":"07513","8713938000210":"22250","8410090781260":"W8811","3230140005048":"09520","3230140005116":"51979","2188914889145":"88914","2185697856975":"85697","2021244282388":"J0316","4820153600539":"W4433","2999356000506":"99356","3760063328370":"R3943","9004617011238":"20820","8003240061598":"07527","4033122001095":"Q6205","2999358000504":"99358","8032454070034":"10828","8032454070850":"10829","2154286542865":"54286","2999375000501":"99375","2155834558345":"55834","4820195680889":"Q7596","2183092830927":"83092","2021000199318":"T9735","3700389400749":"T9735","3760042973508":"T9735","7756386000044":"T9735","7756386000075":"T9735","7756386000099":"T9735","7756386000105":"T9735","7756386000143":"T9735","7756386000150":"T9735","7756386000242":"T9735","7756386000259":"T9735","8436575112107":"T9735","2021000108594":"R2517","2021000108600":"R2518","2162477624771":"62477","4820213260024":"62477","2162476624765":"62476","2700020608528":"62476","2700020608535":"62476","4820213260031":"62476","4820244740267":"62476","4820178811057":"S3466","2153772537729":"53772","9004617011177":"20817","5400706613323":"95324","8003240523683":"66544","2171833718337":"71833","9004617011245":"20823","3760063334494":"R3944","2021244295326":"J3895","2176223762235":"76223","8007760284154":"18573","5204108137612":"90379","2184760847605":"84760","3245270003819":"R9760","5021554005032":"T9860","5021554005865":"T9860","3245270000665":"17793","8014531205676":"17988","8437011668011":"26479","850000341005":"26479","8014531204600":"11191","2021000028106":"Q5697","3760063331752":"R3939","80195535":"D4736","2021000135361":"R7344","5012845205705":"12046","4106060076095":"G7615","3700662760744":"G0086","3230140005635":"09585","2021000069390":"W3946","2021000010262":"Q1314","3301593000246":"R9316","8006165330190":"R2730","2164991649919":"64991","2191679916797":"91679","3760063325829":"R3934","2168959689597":"68959","8014531203375":"07366","2107366073667":"07366","5021554000747":"22907","2021000100024":"W9714","2021000100017":"W9713","2021000100000":"W9712","2021000100031":"W9715","9004145003897":"21040","8003240521276":"66526","8003240211542":"31375","6009657341812":"Q5735","2999355000507":"99355","2021000139529":"R8276","2154095540953":"54095","2500002527294":"54095","8423223210117":"54095","8427148210023":"54095","5060213551404":"F7955","8850213607525":"37054","89060710430802":"R6767","8018102801038":"50128","2968997000503":"68997","2175337753375":"75337","2187655876551":"87655","2190541905419":"90541","2188799887991":"88799","2191433914335":"91433","2184686846867":"84686","2155794557945":"70025","2171235712353":"71235","2021001124661":"F3829","2021001124685":"F3831","2021001124678":"F3830","2021001124692":"F3832","2021000024641":"Q5121","2021000024658":"Q5122","2021000153976":"T1216","2021244293162":"J3176","2021000132384":"R6988","9004617014406":"17185","5032722311596":"W9106","3760063323504":"32236","3760063320725":"10635","2021001106056":"F0227","2171867718679":"71867","2167843678433":"67843","5060092690621":"16300","2021000139406":"R8212","5060092696326":"Q1865","2021000111150":"R3026","4904131494850":"75074","2156124561243":"56124","2021000117893":"R4820","011210009387":"62276","011210009493":"62276","011210613010":"62276","30011210911773":"62276","2171294712943":"71294","2155833558339":"55833","2167419674197":"55833","5021554005476":"T9861","5060092693899":"40665","5021554980100":"24522","2155838558389":"55838","5021554984375":"22962","5021554988335":"22962","2176725767257":"76725","3760063338270":"17772","2155837558373":"55837","024463061163":"75283","2021244284597":"J0798","2021000147722":"T0076","2021000172038":"T3423","6009657341829":"T3423","9004145008632":"40653","6009657342246":"12964","9004145008243":"28730","4860112626521":"R2192","2196988969885":"96988","2021000088216":"W7468","4580168440017":"74237","8006165400091":"W9869","8006165400114":"72316","8007620005523":"99828","5011428300028":"41456","8682125830032":"Q3526","8713246010123":"98177","8007760000280":"18569","2174963749639":"74963","8017995201680":"F2348","4024297158011":"09510","4024297013945":"32310","2168851688513":"68851","2171702717027":"71702","2174043740433":"74043","2163924639249":"63924","2173802738025":"73802","2173803738031":"73803","2165916659167":"65916","2999402001006":"99402","4740018171656":"67591","9004617003080":"20824","9004145002319":"08515","8003240523171":"66538","2170951709517":"70951","5400706000406":"95326","2168539685391":"68539","2188109881091":"88109","0796554845227":"F5833","796554845227":"F5833"};
var PF={"2900164":"44890","2900003":"56141","2900126":"99676","2900017":"55808","2900022":"55807","2900121":"99472","2900082":"55166","2900090":"56286","2900163":"55579","2900030":"55244","2900039":"50014","2900068":"97584","2900147":"55388","2900012":"55815","2900027":"99416","2900167":"66597","2900166":"56985","2900093":"68998","2900104":"99266","2900026":"55885"};
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
window.__inv={pending:null,
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
  var z=document.getElementById('zones');if(!z||document.getElementById('scanb'))return;
  var b=document.createElement('button');b.type='button';b.id='scanb';b.className='primary';b.style.cssText='width:100%;margin:10px 0 2px;min-height:52px;font-size:17px;border-radius:12px';
  b.textContent='Сканувати штрих-код';b.onclick=openScan;z.parentNode.insertBefore(b,z)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addBtn);else addBtn();
window.addEventListener('load',addBtn);
})();
