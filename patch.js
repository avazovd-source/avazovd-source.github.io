/* Інвентаризація голосом — патч v4: артикул (5 знаків) + кількість без паузи */
(function(){
var DIG={'нуль':0,'ноль':0,'один':1,'одна':1,'раз':1,'два':2,'дві':2,'три':3,'чотири':4,'четыре':4,'пять':5,'шість':6,'шесть':6,'сім':7,'семь':7,'вісім':8,'восемь':8,'девять':9};
var byKey=null;
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
    var pre=artPrefix(part,api);if(!pre)return false;
    if(pre.missing){card(api,'<span class="warn">Артикул '+api.esc(pre.missing)+' не знайдено в довіднику.</span> «'+api.esc(part)+'»');return true}
    var p=qtyAfter(pre.a,pre.rest,part,api);
    if(p.qty==null){this.pending=pre.a;card(api,'<div class="big">'+api.esc(pre.a.name)+'</div><div>'+api.esc(pre.a.art)+' · назвіть кількість</div>');return true}
    this.pending=null;await api.commit(pre.a,p,null);return true},
  bare:async function(p,api){if(this.pending&&p.qty!=null){var a=this.pending;this.pending=null;await api.commit(a,p,null)}},
  ready:function(part,api){
    var pre=artPrefix(part,api);
    if(pre&&pre.a)return qtyAfter(pre.a,pre.rest,part,api).qty!=null;
    var p=api.parsePhrase(part);return p.qty!=null&&(p.nameWs.length>0||!!this.pending)}
};
})();
