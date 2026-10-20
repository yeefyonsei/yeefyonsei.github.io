// YEEF 홈페이지 공통 동작: 휴대폰 메뉴, 최근 발제, 아카이브 거르기, 차트
(function(){
  const btn=document.getElementById('menuBtn'), links=document.getElementById('navlinks');
  if(btn&&links){
    btn.addEventListener('click',()=>{const o=links.classList.toggle('open');btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus()}});
  }
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const post=it=>`<a class="post" href="#${esc(it.id)}" data-id="${esc(it.id)}"><img src="${esc(it.cover)}" alt="${esc(it.title)} 카드뉴스 표지" loading="lazy" width="540" height="675">
    <div class="post__meta"><span class="tag">${esc(it.term)} ${esc(it.type)}</span><span class="post__n">${it.images.length}장</span></div>
    <h3>${esc(it.title)}</h3><p>${esc(it.sub)}</p></a>`;
  const load=()=>fetch('data/archive.json').then(r=>{if(!r.ok)throw 0;return r.json()});
  const fail=el=>{el.innerHTML='<p class="empty">자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'};
  function viewer(d){
    const dl=document.getElementById('viewer'); if(!dl) return ()=>{};
    const tr=vTrack; let cur=null;
    const upd=()=>{const i=Math.round(tr.scrollLeft/tr.clientWidth);vCount.textContent=`${i+1} / ${cur.images.length}`};
    const open=id=>{cur=d.find(x=>x.id===id); if(!cur) return;
      vTitle.textContent=cur.title; tr.innerHTML=cur.images.map((s,i)=>`<img src="${esc(s)}" alt="${esc(cur.title)} ${i+1}번째 카드" loading="${i<2?'eager':'lazy'}">`).join('');
      dl.showModal(); tr.scrollLeft=0; upd(); tr.focus(); history.replaceState(null,'','#'+id)};
    const go=n=>tr.scrollBy({left:n*tr.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    tr.addEventListener('scroll',()=>cur&&upd(),{passive:true});
    vPrev.onclick=()=>go(-1); vNext.onclick=()=>go(1); vClose.onclick=()=>dl.close();
    dl.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
    dl.addEventListener('close',()=>history.replaceState(null,'',location.pathname+location.search));
    dl.addEventListener('click',e=>{if(e.target===dl)dl.close()});
    return open;
  }
  const order={'26-2':0,'26-1':1,'25-2':2,'25-1':3};
  window.YEEF_SITE={
    recent(n){const el=document.getElementById('recent');load().then(d=>{el.innerHTML=d.slice(0,n).map(post).join('');
      el.querySelectorAll('.post').forEach(a=>a.href='archive.html#'+a.dataset.id)}).catch(()=>fail(el))},
    archive(){
      const el=document.getElementById('list'),em=document.getElementById('empty'),cnt=document.getElementById('fCount');
      const sel={type:fType,term:fTerm};
      load().then(d=>{
        const open=viewer(d);
        for(const k in sel){[...new Set(d.map(x=>x[k]))].forEach(v=>sel[k].insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`))}
        const q=new URLSearchParams(location.search);for(const k in sel){if(q.get(k))sel[k].value=q.get(k)}
        const run=()=>{const r=d.filter(x=>Object.keys(sel).every(k=>!sel[k].value||x[k]===sel[k].value));
          el.innerHTML=r.map(post).join('');em.hidden=r.length>0;cnt.textContent=`${r.length}건`;
          el.querySelectorAll('.post').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open(a.dataset.id)}));
          const p=new URLSearchParams();for(const k in sel){if(sel[k].value)p.set(k,sel[k].value)}history.replaceState(null,'',(p.toString()?'?'+p:location.pathname)+location.hash)};
        Object.values(sel).forEach(s=>s.addEventListener('change',run));run();
        if(location.hash) open(decodeURIComponent(location.hash.slice(1)));
      }).catch(()=>fail(el));
    },
    majorChart(){const Y=YEEF_CHART,maj=[['경제·경영',100],['공학',68],['사회과학',37],['자연과학',29],['인문',20],['융합',18]];
      const dark=getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim().toLowerCase()==='#0f201b';
      const pc=[...Y.series(),dark?'#D6E36E':'#7E8E08',Y.other()];
      new Chart(cMajor,{type:'doughnut',data:{labels:maj.map(m=>m[0]),datasets:[{data:maj.map(m=>m[1]),backgroundColor:pc,borderColor:getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim(),borderWidth:2}]},
        options:{cutout:'55%',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.label} ${c.raw}명 (${Math.round(c.raw/272*100)}%)`}}}}});
      lMajor.innerHTML=maj.map((m,i)=>`<li><i style="background:${pc[i]}"></i><span>${m[0]}</span><span><b>${Math.round(m[1]/272*100)}%</b><small>${m[1]}명</small></span></li>`).join('')},
    careerChart(){const Y=YEEF_CHART,car=[['전자·제조 등 기업',41],['대학원·연구',40],['에너지·화학·소재 기업',30],['금융',26],['법조·공공',23],['컨설팅·회계',9]];
      new Chart(cCareer,{type:'bar',data:{labels:car.map(c=>c[0]),datasets:[{data:car.map(c=>c[1]),backgroundColor:car.map(c=>c[0].startsWith('에너지')?Y.highlight():Y.muted())}]},
        options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,title:{display:true,text:'명'}},y:{grid:{display:false}}}}})},
    topicChart(){const Y=YEEF_CHART,t=[['전력계통',6],['공급망 구축',5],['기후위기와 지속가능경영',5],['산업 공정과 기술',4],['신재생에너지',3],['화석연료',2],['원자력',2],['정책·법률·국제협약',2]];
      new Chart(cTopic,{type:'bar',data:{labels:t.map(x=>x[0]),datasets:[{data:t.map(x=>x[1]),backgroundColor:Y.highlight()}]},
        options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{stepSize:2},title:{display:true,text:'건'}},y:{grid:{display:false}}}}})}
  };
})();
