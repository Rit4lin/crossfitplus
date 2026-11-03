(() => {
  'use strict';
  const picker = document.getElementById('insights-week');
  if (!picker) return;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());
  const current = Math.max(1,Math.min(52,Math.floor((today-Date.UTC(2026,7,24))/(7*86400000))+1));
  const fmt = n => new Intl.NumberFormat('es-ES').format(n);
  const load = w => Math.round(660+w*6.5+Math.sin(w*.91)*74+Math.cos(w*.47)*46-(w%4===0?118:0));
  const names = ['L','M','X','J','V'];
  for(let w=current;w>=Math.max(1,current-16);w--){
    const option=document.createElement('option');
    option.value=String(w);
    option.textContent='Semana '+String(w).padStart(2,'0');
    picker.append(option);
  }
  function render(w){
    const v=load(w), prev=load(Math.max(1,w-1));
    const change=prev?100*(v-prev)/prev:0;
    document.getElementById('insights-load').innerHTML=fmt(v)+' <small>UA</small>';
    const delta=document.getElementById('insights-delta');
    delta.textContent=(change>0?'+':'')+change.toFixed(1).replace('.',',')+' % vs anterior';
    delta.classList.toggle('negative',change<0);
    const points=[];
    for(let i=Math.max(1,w-9);i<=w;i++)points.push({week:i,value:load(i)});
    const left=58,right=652,top=15,bottom=186;
    const x=i=>left+(points.length===1?0:i*(right-left)/(points.length-1));
    const y=v=>bottom-(v-400)*(bottom-top)/600;
    const stroke=points.map((p,i)=>(i===0?'M':'L')+x(i).toFixed(1)+' '+y(p.value).toFixed(1)).join(' ');
    const fill=stroke+' L '+x(points.length-1).toFixed(1)+' '+bottom+' L '+left+' '+bottom+' Z';
    const grid=[400,550,700,850,1000].map(v=>'<line class="grid-line" x1="'+left+'" x2="'+right+'" y1="'+y(v).toFixed(1)+'" y2="'+y(v).toFixed(1)+'"/><text x="48" y="'+(y(v)+4).toFixed(1)+'" text-anchor="end">'+fmt(v)+'</text>').join('');
    const marks=points.map((p,i)=>{
      const xx=x(i).toFixed(1),yy=y(p.value).toFixed(1);
      const lbl=i===0||i===points.length-1||i%2===0?'<text x="'+xx+'" y="215" text-anchor="middle">S'+String(p.week).padStart(2,'0')+'</text>':'';
      const dot=i===points.length-1?'<circle class="focus-ring" cx="'+xx+'" cy="'+yy+'" r="12"/><circle class="marker" cx="'+xx+'" cy="'+yy+'" r="6"/>':'<circle cx="'+xx+'" cy="'+yy+'" r="3.5" fill="#a2c986"/>';
      return lbl+'<g><title>Semana '+p.week+': '+fmt(p.value)+' UA</title>'+dot+'</g>';
    }).join('');
    const chart=document.getElementById('insights-graph');
    chart.innerHTML='<defs><linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bcf78b" stop-opacity=".35"/><stop offset="100%" stop-color="#bcf78b" stop-opacity="0"/></linearGradient></defs>'+grid+'<path class="area" d="'+fill+'"/><path class="line" d="'+stroke+'"/>'+marks;
    chart.setAttribute('aria-label','Carga prevista de las semanas '+points[0].week+' a '+w+'. Semana '+w+': '+v+' unidades de carga relativas.');
    const force=Math.round(40+Math.sin(w*.63)*5);
    const metcon=Math.round(38+Math.cos(w*.48)*4);
    const technique=100-force-metcon;
    const donut=document.getElementById('insights-donut');
    donut.style.background='conic-gradient(#c5f38c 0 '+force+'%, #81b5a4 '+force+'% '+(force+metcon)+'%, #698161 '+(force+metcon)+'% 100%)';
    donut.setAttribute('aria-label','Fuerza '+force+'%, metcon '+metcon+'%, técnica y movilidad '+technique+'%');
    document.getElementById('insights-legend').innerHTML=[
      ['#c5f38c','Fuerza',force],['#81b5a4','Metcon',metcon],['#698161','Técnica',technique]
    ].map(a=>'<div class="mix-legend-row"><i class="dot" style="background:'+a[0]+'"></i><span>'+a[1]+'</span><strong>'+a[2]+'%</strong></div>').join('');
    const daily=[72,83,65,90,76].map((n,i)=>Math.round(Math.min(98,Math.max(35,n+Math.sin(w*1.1+i*1.7)*11))));
    const el=document.getElementById('insights-daily');
    el.innerHTML=daily.map((pct,i)=>'<div class="daily-item"><div class="daily-track"><div class="daily-fill" style="height:'+pct+'%"></div></div><span>'+names[i]+'</span></div>').join('');
    el.setAttribute('aria-label','Intensidad de lunes a viernes: '+daily.join(', ')+'%');
  }
  picker.addEventListener('change',()=>render(Number(picker.value)));
  render(current);
})();
