/* ================= CONTENT RENDERING (data lives in content.js) ================= */
const C = window.CONTENT || {};
let LANG = 'en';
const tx = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[LANG] || v.en || '') : (v || '');
const ui = k => ((window.CONTENT_I18N||{})[LANG]||{})[k] || ((window.CONTENT_I18N||{}).en||{})[k] || k;
const phMark = s => String(s).replace(/\[([^\]]+)\]/g, '<mark class="ph">[$1]</mark>');

const PROOFS = {
  alb: () => `<div class="proof"><div class="proof-bar"><span>aws elbv2 describe-target-health</span><em>illustrative · fake IDs</em></div>
<pre><b>TARGET</b>                 <b>AZ</b>          <b>STATE</b>
i-0aaaa1111bbbb2222    us-east-1a  <i class="ok">healthy</i>
i-0cccc3333dddd4444    us-east-1b  <i class="ok">healthy</i>
i-0eeee5555ffff6666    us-east-1a  <i class="warn">initial</i>  <span class="dim"># scale-out in progress</span></pre></div>`,
  iam: () => `<div class="proof"><div class="proof-bar"><span>trust-policy.json — diff</span><em>illustrative · fake ARNs</em></div>
<pre>  "Effect": "Allow",
<i class="del">- "Principal": { "AWS": "arn:aws:iam::123456789012:user/wrong-user" },</i>
<i class="add">+ "Principal": { "Service": "ec2.amazonaws.com" },</i>
  "Action": "sts:AssumeRole"</pre></div>`,
  s3: () => `<div class="proof"><div class="proof-bar"><span>bucket-policy.json</span><em>illustrative · fake IDs</em></div>
<pre>"Principal": { "Service": "cloudfront.amazonaws.com" },
"Action": "s3:GetObject",
"Condition": { "StringEquals": {
  "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/EXAMPLE123" } }
<span class="dim">$ curl -I https://example-bucket.s3.amazonaws.com/index.html</span>
<i class="del">HTTP/1.1 403 Forbidden</i>  <span class="dim"># direct access blocked ✓</span></pre></div>`,
  vlan: () => `<div class="proof"><div class="proof-bar"><span>Switch# show vlan brief</span><em>illustrative</em></div>
<pre><b>VLAN NAME        STATUS   PORTS</b>
10   SALES       active   Fa0/1, Fa0/2
20   IT          active   Fa0/3, Fa0/4
99   MGMT        active   Fa0/24</pre></div>`
};
window.projectExtraHTML = function(id){
  const x = (C.projectsExtra||{})[id]; if(!x) return '';
  const repo = x.repo ? `<a class="btn-secondary" href="${x.repo}" target="_blank" rel="noopener noreferrer">${ui('proj.repo')} ↗</a>` : `<span class="btn-secondary is-ph">${ui('proj.repo')} <mark class="ph">[ADD REPO / WRITE-UP URL]</mark></span>`;
  return `<div class="cs-block"><div class="cs-num">${ui('proj.role')}</div><p>${phMark(x.role)}</p></div>
  <div class="cs-block"><div class="cs-num">${ui('proj.metric')}</div><p>${phMark(x.metric)}</p></div>
  <div class="cs-block"><div class="cs-num">${ui('proj.proof')}</div>${(PROOFS[x.proof]||(()=>''))()}</div>
  <div class="cs-block"><details class="how"><summary>README · ${ui('proj.how')}</summary><ol>${x.how.map(h=>`<li>${phMark(h)}</li>`).join('')}</ol></details></div>
  <div class="cs-block">${repo}</div>`;
};

function renderCredentials(){
  const grid = document.getElementById('credGrid'); if(!grid) return;
  const items = C.credentials || [];
  grid.innerHTML = items.map(c=>`<article class="card cred-card" data-cat="${c.cat}">
    <div class="cred-top"><span class="ico-badge sm" data-ico="${c.cat==='networking'?'nodes':c.cat==='aws'?'cloud':'loop'}" data-ico-size="ico-sm"></span>
      <span class="status-badge ${c.status}">${c.status==='done'?ui('cred.done'):ui('cred.progress')}</span></div>
    <h3>${tx(c.title)}</h3>
    <div class="meta">${tx(c.issuer)} · ${c.date}</div>
    <p><b class="mini-label">${ui('cred.learn')}</b> ${tx(c.learnings)}</p>
    <div class="proj-tags">${(c.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>
    ${c.link ? `<a class="cred-link" href="${c.link}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ''}
  </article>`).join('') + `<p class="cred-empty" hidden>${ui('cred.empty')}</p>`;
  applyCredFilter();
}
let credFilter = 'all';
function applyCredFilter(){
  const cards = [...document.querySelectorAll('.cred-card')];
  let shown = 0;
  cards.forEach(c=>{ const on = credFilter==='all' || c.dataset.cat===credFilter; c.hidden = !on; if(on) shown++; });
  const e = document.querySelector('.cred-empty'); if(e) e.hidden = shown>0;
}

function renderSkills(){
  const wrap = document.getElementById('skillGroups'); if(!wrap) return;
  const strip = document.getElementById('stackStrip');
  if(strip) strip.innerHTML = (C.stack||[]).map(s=>`<div class="tool-card" data-brand="${s.brand}"><b>${s.name}</b><span>${s.level==='hands'?ui('skills.hands'):ui('skills.learning')}</span></div>`).join('');
  const seen = new Set();
  wrap.innerHTML = (C.skills||[]).map(g=>{
    const items = g.items.filter(i=>{ const k=i.name.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true; });
    return `<div class="card skill-group">
      <div class="sg-head"><span class="sg-brand" data-brand="${g.brand}"></span><h3>${tx(g.label)}</h3><span class="sg-count">${items.length}</span></div>
      <ul class="sk-list">${items.map(i=>`<li class="sk-chip${i.highlight?' hl':' extra'}"><span>${i.name}</span><em class="lvl ${i.level}">${i.level==='hands'?ui('skills.hands'):ui('skills.learning')}</em></li>`).join('')}</ul>
    </div>`;
  }).join('');
  const btn = document.getElementById('skillsToggle');
  if(btn) btn.textContent = wrap.classList.contains('expanded') ? ui('skills.less') : ui('skills.more');
}

function renderExperience(){
  const el = document.getElementById('expTimeline'); if(!el) return;
  el.innerHTML = (C.experience||[]).map(x=>`<article class="exp-item">
    <span class="exp-dot${x.ongoing?' live':''}"></span>
    <div class="card exp-card">
      <div class="exp-head"><div><h3>${tx(x.title)}</h3><div class="meta">${tx(x.sub)}</div></div>
        <div class="exp-when"><span class="mono">${phMark(tx(x.date))}</span>${x.ongoing?`<span class="status-badge progress">${ui('exp.ongoing')}</span>`:''}</div></div>
      <div class="car">
        <div><b class="mini-label">${ui('exp.challenge')}</b><p>${phMark(tx(x.challenge))}</p></div>
        <div><b class="mini-label">${ui('exp.action')}</b><p>${phMark(tx(x.action))}</p></div>
        <div><b class="mini-label">${ui('exp.result')}</b><p>${phMark(tx(x.result))}</p></div>
      </div>
      <div class="proj-tags">${(x.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>
    </div></article>`).join('');
}

function money(p){ const c = C.pricing.currency; return `${c}${p.from}–${c}${p.to}`; }
function renderServices(){
  const el = document.getElementById('svcGrid'); if(!el) return;
  el.innerHTML = (C.services||[]).map(s=>`<article class="card svc-card">
    <span class="ico-badge sm" data-ico="${s.icon}" data-ico-size="ico-sm"></span>
    <h3>${tx(s.title)}</h3><p>${tx(s.desc)}</p>
    <b class="mini-label">${ui('svc.deliverables')}</b>
    <ul class="ticks">${s.deliverables.map(d=>`<li>${tx(d)}</li>`).join('')}</ul>
    <div class="svc-foot"><a href="#contact" class="btn-secondary sm" data-request="${tx(s.title)}">${ui('svc.request')}</a>
    <a href="#pricing" class="svc-price mono">${(()=>{const p=(C.pricing.plans||[]).find(p=>p.id===s.plan);return p?money(p):'';})()}</a></div>
  </article>`).join('');
}
function renderPricing(){
  const el = document.getElementById('priceGrid'); if(!el) return;
  const P = C.pricing;
  el.innerHTML = P.plans.map(p=>`<article class="card price-card${p.recommended?' rec':''}">
    ${p.recommended?`<span class="rec-badge">${ui('price.rec')}</span>`:''}
    <h3>${tx(p.name)}</h3>
    <div class="price"><b>${money(p)}</b><span>${tx(p.unit)}</span></div>
    <b class="mini-label">${ui('price.incl')}</b>
    <ul class="ticks">${p.includes.map(i=>`<li>${phMark(tx(i))}</li>`).join('')}</ul>
    <a href="#contact" class="${p.recommended?'btn-primary':'btn-secondary'} sm" data-request="${tx(p.name)}">${ui('price.cta')}</a>
  </article>`).join('') + `<article class="card price-card custom">
    <h3>${tx(P.custom.name)}</h3><p>${tx(P.custom.desc)}</p>
    <a href="#contact" class="btn-secondary sm" data-request="${tx(P.custom.name)}">${ui('price.customCta')}</a></article>`;
}
function renderAchievements(){
  const sec = document.getElementById('achievements'); if(!sec) return;
  const items = C.achievements || [];
  if(!items.length){ sec.remove(); document.querySelectorAll('a[href="#achievements"]').forEach(a=>a.remove()); return; }
  sec.querySelector('.ach-list').innerHTML = items.map(a=>`<li class="card"><span class="mono">${a.date}</span><b>${tx(a.title)}</b><p>${tx(a.desc)}</p></li>`).join('');
}
function renderLinks(){
  const s = C.site || {};
  document.querySelectorAll('[data-link="github"]').forEach(a=>{ if(s.github){ a.href=s.github; a.hidden=false; } else a.hidden=true; });
  document.querySelectorAll('[data-link="cv"]').forEach(a=>a.href=s.cv);
  document.querySelectorAll('[data-link="hosting"]').forEach(a=>a.textContent=tx(s.hosting));
}

window.renderContent = function(lang){
  LANG = lang || 'en';
  renderCredentials(); renderSkills(); renderExperience(); renderServices(); renderPricing(); renderAchievements(); renderLinks();
  ['#credGrid','#skillGroups','#stackStrip','#expTimeline','#svcGrid','#priceGrid'].forEach(sel=>{
    const el = document.querySelector(sel); if(!el) return;
    mountIcons(el); mountBrands(el);
    el.querySelectorAll('.card, .tool-card').forEach(c=>attachDepth(c, { tilt:3, lift:4, scale:1.01 }));
  });
  if(window.Terminal) window.Terminal.relang();
};
/* ================= ICON SYSTEM ================= */
const ICONS = {
  cloud:'<path d="M7 18h9.5a3.5 3.5 0 0 0 .4-7A5.5 5.5 0 0 0 6.4 9.6 3.7 3.7 0 0 0 7 18Z"/>',
  terminal:'<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7.5 10 2.5 2.2-2.5 2.2M13 14.6h3.6"/>',
  nodes:'<circle cx="12" cy="5.2" r="2.2"/><circle cx="5.5" cy="17.5" r="2.2"/><circle cx="18.5" cy="17.5" r="2.2"/><path d="M10.6 7.1 6.9 15.6M13.4 7.1l3.7 8.5M7.7 17.5h8.6"/>',
  router:'<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 16.5h.01M10.5 16.5h.01M12 10V6.5M12 6.5 9 4M12 6.5 15 4"/>',
  key:'<circle cx="8.5" cy="12" r="3.5"/><path d="M12 12h8M17.5 12v3M20 12v2.2"/>',
  branch:'<circle cx="7" cy="6" r="2.2"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="8.5" r="2.2"/><path d="M7 8.2v7.6M17 10.7c0 3.1-2.4 4.2-5.1 4.7"/>',
  loop:'<path d="M4.5 12a7.5 7.5 0 0 1 12.9-5.2M19.5 12a7.5 7.5 0 0 1-12.9 5.2"/><path d="M17.6 3.6v3.4h-3.4M6.4 20.4V17H9.8"/>',
  wrench:'<path d="M15.4 4.4a5 5 0 0 0-6.2 6.4l-5 5a1.8 1.8 0 0 0 2.6 2.6l5-5a5 5 0 0 0 6.3-6.3l-2.7 2.7-2.6-.4-.4-2.6Z"/>',
  layers:'<path d="M12 3.8 3.8 8 12 12.2 20.2 8 12 3.8Z"/><path d="m4 12.4 8 4.1 8-4.1M4 16.6l8 4.1 8-4.1"/>',
  shield:'<path d="M12 3.6 5 6.3v5c0 4.2 2.9 7.4 7 9.1 4.1-1.7 7-4.9 7-9.1v-5l-7-2.7Z"/>',
  scale:'<path d="M5 19V9.8M12 19V5M19 19v-6.6"/><path d="M3.5 19h17"/>',
  search:'<circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 4 4"/>',
  check:'<circle cx="12" cy="12" r="8.4"/><path d="m8.4 12.2 2.5 2.5 4.7-4.9"/>',
  arrow:'<path d="M8 16 16 8M9.6 8H16v6.4"/>',
  mail:'<rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.4"/><path d="m4.4 7.4 7.6 5.4 7.6-5.4"/>',
  linkedin:'<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4"/><path d="M8 10.4V16M8 7.6v.01M12 16v-3.2a1.9 1.9 0 0 1 3.8 0V16"/>',
  pin:'<path d="M12 21c4-4.4 6-7.5 6-10a6 6 0 0 0-12 0c0 2.5 2 5.6 6 10Z"/><circle cx="12" cy="11" r="2.2"/>',
  spark:'<path d="M12 4.2 13.7 9l4.8 1.7-4.8 1.7L12 17.2l-1.7-4.8L5.5 10.7 10.3 9 12 4.2Z"/>',
  github:'<path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  book:'<path d="M5 5.4A2 2 0 0 1 7 3.4h11.2v14H7a2 2 0 0 0-2 2V5.4Z"/><path d="M5 19.4a2 2 0 0 1 2-2h11.2v3.2H7a2 2 0 0 1-2-1.2Z"/>'
};
function svgIco(name, extra){
  return '<svg class="ico '+(extra||'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(ICONS[name]||'')+'</svg>';
}
function mountIcons(root){
  (root||document).querySelectorAll('[data-ico]').forEach(el=>{
    if(el.querySelector('svg.ico')) return;
    el.insertAdjacentHTML('afterbegin', svgIco(el.dataset.ico, el.dataset.icoSize||''));
  });
}

/* ================= BRAND MARKS =================
   Recognisable technology marks drawn in each brand's own palette,
   normalised to one 32x32 grid so they sit in the same card system. */
const BRANDS = {
  aws:{ tint:'rgba(255,153,0,0.16)', svg:`
    <path d="M6 11.2c0-1.2.9-2 2.4-2 1 0 1.8.3 2.4.8v1.3c-.6-.5-1.3-.8-2.1-.8-.8 0-1.2.3-1.2.8s.4.7 1.4 1c1.4.4 2.1 1 2.1 2.1 0 1.3-1 2.1-2.6 2.1-1 0-1.9-.3-2.5-.8v-1.4c.7.6 1.5.9 2.3.9.9 0 1.4-.3 1.4-.8 0-.5-.4-.7-1.5-1C6.7 13 6 12.4 6 11.2Z" fill="var(--brand-neutral)" transform="translate(13.4 0)"/>
    <path d="m12.6 9.3 1.6 5.1 1.4-5.1h1.4l1.4 5.1 1.6-5.1h1.4l-2.3 7h-1.4l-1.4-5-1.4 5h-1.4l-2.3-7h1.4Z" fill="var(--brand-neutral)"/>
    <path d="M23.6 9.2c1.9 0 2.9.9 2.9 2.7v4.4h-1.3v-.9c-.5.7-1.3 1-2.2 1-1.4 0-2.3-.8-2.3-2 0-1.3 1-2.1 2.9-2.1h1.5v-.4c0-.9-.5-1.4-1.6-1.4-.8 0-1.5.2-2.2.6v-1.3c.7-.4 1.5-.6 2.3-.6Zm1.5 4.1h-1.3c-1 0-1.5.3-1.5 1 0 .6.4.9 1.2.9.8 0 1.6-.5 1.6-1.4v-.5Z" fill="var(--brand-neutral)" transform="translate(-16.4 0)"/>
    <path d="M4.4 20.6c5 3 11.4 4.6 17 4.6 3.8 0 8-.8 11.9-2.4.6-.3 1.1.4.5.8-3.5 2.6-8.6 4-13 4-6.2 0-11.7-2.3-15.9-6.1-.3-.3-.1-.8.5-.9Z" fill="#F90" transform="translate(-1.6 -1.4) scale(.95)"/>
    <path d="M23.2 19.1c.7-.9 4.6-.4 6.4-.2.3 0 .4.3.1.5-1.4 1-3.7 2.4-4.9 2.9-.4.2-.7 0-.5-.4.5-1.3 1.3-3.3.9-3.8-.4-.5-2.6-.2-3.6-.1-.3 0-.4-.2-.1-.5.4-.4 1.2-.5 1.7-.4Z" fill="#F90" transform="translate(-1.2 -1) scale(.95)"/>`},
  linux:{ tint:'rgba(247,191,31,0.18)', svg:`
    <ellipse cx="16" cy="19" rx="7.4" ry="8.4" fill="var(--brand-neutral)"/>
    <ellipse cx="16" cy="21.6" rx="4.6" ry="5" fill="rgba(128,128,136,0.35)"/>
    <ellipse cx="13.3" cy="11.6" rx="2.5" ry="3.2" fill="var(--brand-neutral)"/>
    <ellipse cx="18.7" cy="11.6" rx="2.5" ry="3.2" fill="var(--brand-neutral)"/>
    <circle cx="13.5" cy="11.8" r="1" fill="var(--bg-alt)"/><circle cx="18.5" cy="11.8" r="1" fill="var(--bg-alt)"/>
    <circle cx="13.6" cy="12" r=".55" fill="var(--brand-neutral)"/><circle cx="18.4" cy="12" r=".55" fill="var(--brand-neutral)"/>
    <path d="M16 13.6c1.4 0 2.4.8 2.4 1.5S17.2 16.6 16 16.6s-2.4-.8-2.4-1.5 1-1.5 2.4-1.5Z" fill="#F7BF1F"/>
    <path d="M11.4 25.6c-.9 1-2.2 1.6-2 2.2.2.6 2 .6 3.2.1.9-.4 1-1.4.6-2.2-.4-.5-1.2-.6-1.8-.1Zm9.2 0c.9 1 2.2 1.6 2 2.2-.2.6-2 .6-3.2.1-.9-.4-1-1.4-.6-2.2.4-.5 1.2-.6 1.8-.1Z" fill="#F7BF1F"/>`},
  docker:{ tint:'rgba(36,150,237,0.18)', svg:`
    <g fill="#2496ED">
      <rect x="7" y="14.5" width="4" height="3.6" rx=".5"/>
      <rect x="11.6" y="14.5" width="4" height="3.6" rx=".5"/>
      <rect x="16.2" y="14.5" width="4" height="3.6" rx=".5"/>
      <rect x="11.6" y="10.4" width="4" height="3.6" rx=".5"/>
      <rect x="16.2" y="10.4" width="4" height="3.6" rx=".5"/>
      <rect x="16.2" y="6.3" width="4" height="3.6" rx=".5"/>
    </g>
    <path d="M28.4 15.3c-1.1-.7-3-.5-3.9-.2-.2-1.5-1-2.7-2.3-3.7l-.7-.5-.5.8c-.6 1-.8 2.6-.1 3.8H4.6c-.4 3.2.5 6.3 2.7 8.2 1.8 1.5 4.3 2.2 7.4 2.2 6.7 0 11.6-3.1 13.9-8.7 1 0 2.3 0 3-1.3l.4-.7-.6-.4c-.6-.4-1.9-.4-3-.1Z" fill="#2496ED" transform="translate(-.8 -.6) scale(.95)"/>`},
  kubernetes:{ tint:'rgba(50,108,229,0.18)', svg:`
    <path d="m16 3.4 10.6 5.1 2.6 11.4-7.3 9.1H10.1l-7.3-9.1L5.4 8.5 16 3.4Z" fill="#326CE5"/>
    <g fill="#fff">
      <circle cx="16" cy="16" r="2.6"/>
      <path d="M15.4 7.6h1.2v4.3h-1.2zM15.4 20.1h1.2v4.3h-1.2zM7.9 15.4h4.3v1.2H7.9zM19.8 15.4h4.3v1.2h-4.3z"/>
      <path d="m10.4 10 3.1 3-.9.9-3-3.1zM18.5 18.1l3 3.1-.8.8-3.1-3zM21.6 10.8l-3.1 3-.8-.9 3-3zM13.5 18.9l-3 3.1-.9-.9 3.1-3z"/>
    </g>`},
  git:{ tint:'rgba(240,80,50,0.18)', svg:`
    <path d="M28.9 14.6 17.4 3.1a1.6 1.6 0 0 0-2.2 0l-2.4 2.4 3 3a1.9 1.9 0 0 1 2.4 2.4l2.9 2.9a1.9 1.9 0 1 1-1.1 1.1L17.3 12v7.1a1.9 1.9 0 1 1-1.6-.1V12a1.9 1.9 0 0 1-1-2.5l-3-3-8.6 8.6a1.6 1.6 0 0 0 0 2.2l11.5 11.5a1.6 1.6 0 0 0 2.2 0l11.1-11a1.6 1.6 0 0 0 0-2.2Z" fill="#F05032"/>`},
  github:{ tint:'rgba(120,120,130,0.16)', svg:`
    <path d="M16 3.6a12.4 12.4 0 0 0-3.9 24.2c.6.1.9-.3.9-.6v-2.2c-3.5.8-4.2-1.7-4.2-1.7-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.3.1 1.9 1.3 1.9 1.3 1.1 1.9 3 1.4 3.7 1 .1-.8.4-1.4.8-1.7-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.5 1.3-3.4-.2-.3-.6-1.6.1-3.3 0 0 1.1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.7.3 3 .1 3.3.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.9-5.7 6.2.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.9.6A12.4 12.4 0 0 0 16 3.6Z" fill="var(--brand-neutral,#181717)"/>`},
  terraform:{ tint:'rgba(123,66,188,0.18)', svg:`
    <g fill="#7B42BC">
      <path d="M12.6 6 19 9.7v7.4l-6.4-3.7V6Z"/>
      <path d="M19.7 9.7 26.1 6v7.4l-6.4 3.7V9.7Z"/>
      <path d="M5.9 2.2l6.4 3.7v7.4L5.9 9.6V2.2Z" transform="translate(0 .6)"/>
      <path d="M12.6 18.1l6.4 3.7v7.4l-6.4-3.7v-7.4Z"/>
    </g>`},
  python:{ tint:'rgba(55,118,171,0.18)', svg:`
    <path d="M15.8 3.2c-1.9 0-3.6.2-5.1.5-2.5.5-3 1.5-3 3.4v3.2h6.1v.8H5.4c-2.4 0-4.4 1.4-5.1 4.1-.7 3.1-.8 5 0 8.2.6 2.4 2 4.1 4.4 4.1h2.2v-3.9c0-2.7 2.3-5 5.1-5h6.1c2.3 0 4.1-1.9 4.1-4.2V7.1c0-2.2-1.9-3.9-4.1-4.3-1.4-.2-2.9-.4-4.3-.4Zm-3.3 2.5c.7 0 1.2.5 1.2 1.2 0 .6-.5 1.2-1.2 1.2-.6 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2Z" fill="#3776AB" transform="translate(3.4 1.4) scale(.82)"/>
    <path d="M25.4 11.1v3.8c0 2.8-2.4 5.2-5.1 5.2h-6.1c-2.2 0-4.1 1.9-4.1 4.2v7.9c0 2.2 2 3.6 4.1 4.2 2.6.8 5 .9 8.1 0 2-.6 4.1-1.8 4.1-4.2v-3.2h-6.1v-.8h9.1c2.4 0 3.3-1.7 4.1-4.1.8-2.5.8-5 0-8.3-.6-2.4-1.7-4.1-4.1-4.1h-3.9Zm-3.4 14.7c.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2s-1.2-.6-1.2-1.2c0-.7.5-1.2 1.2-1.2Z" fill="#FFD43B" transform="translate(-1.6 -1.4) scale(.82)"/>`},
  cisco:{ tint:'rgba(27,160,215,0.18)', svg:`
    <g fill="#1BA0D7">
      <rect x="3" y="15" width="2.2" height="5" rx="1.1"/>
      <rect x="7.6" y="12" width="2.2" height="11" rx="1.1"/>
      <rect x="12.2" y="15" width="2.2" height="5" rx="1.1"/>
      <rect x="16.8" y="8" width="2.2" height="19" rx="1.1"/>
      <rect x="21.4" y="12" width="2.2" height="11" rx="1.1"/>
      <rect x="26" y="15" width="2.2" height="5" rx="1.1"/>
    </g>`},
  iam:{ tint:'rgba(221,52,76,0.16)', svg:`
    <path d="M16 3.4 5.6 7.6v7.2c0 6.3 4.3 11.2 10.4 13.8 6.1-2.6 10.4-7.5 10.4-13.8V7.6L16 3.4Z" fill="#DD344C"/>
    <circle cx="16" cy="14" r="3.1" fill="#fff"/>
    <path d="M16 17.4c-3 0-5.4 1.7-5.4 3.8v1.2h10.8v-1.2c0-2.1-2.4-3.8-5.4-3.8Z" fill="#fff"/>`},
  network:{ tint:'rgba(88,140,196,0.16)', svg:`
    <g fill="none" stroke="#588CC4" stroke-width="1.9" stroke-linecap="round">
      <circle cx="16" cy="6.6" r="3"/><circle cx="6.6" cy="24" r="3"/><circle cx="25.4" cy="24" r="3"/>
      <path d="m13.6 8.9-5 12.3M18.4 8.9l5 12.3M9.6 24h12.8"/>
    </g>`},
  bash:{ tint:'rgba(120,120,130,0.14)', svg:`
    <rect x="3.4" y="5.6" width="25.2" height="20.8" rx="4" fill="#2B2B31"/>
    <path d="m9.4 12.6 4 3.6-4 3.6M16.6 20.2h6.4" fill="none" stroke="#9BE58A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`}
};
function brandSVG(name, extra){
  const b = BRANDS[name];
  if(!b) return '';
  return '<svg class="brand '+(extra||'')+'" viewBox="0 0 32 32" aria-hidden="true" focusable="false">'+b.svg+'</svg>';
}
function mountBrands(root){
  (root||document).querySelectorAll('[data-brand]').forEach(el=>{
    if(el.querySelector('svg.brand')) return;
    const key = el.dataset.brand;
    const b = BRANDS[key];
    if(!b) return;
    const wrap = document.createElement('span');
    wrap.className = 'brand-wrap' + (el.dataset.brandSize === 'sm' ? ' sm' : '');
    wrap.innerHTML = brandSVG(key, el.dataset.brandSize === 'sm' ? 'brand-sm' : '');
    el.style.setProperty('--brand-tint', b.tint);
    el.insertBefore(wrap, el.firstChild);
  });
}

/* ================= GLOBAL NUMBER TOKEN =================
   Every numeric run in the page is wrapped in the same .num token so
   numbers share one typographic system instead of per-section styling. */
const NUM_RE = /\d[\d.,:/%+-]*/g;
function mountNumbers(root){
  const scope = root || document.body;
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      if(!node.nodeValue || !/\d/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if(!p) return NodeFilter.FILTER_REJECT;
      if(p.closest('script, style, svg, .num, [data-count], #cursor')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const targets = [];
  while(walker.nextNode()) targets.push(walker.currentNode);
  targets.forEach(node=>{
    const frag = document.createDocumentFragment();
    let last = 0, m;
    NUM_RE.lastIndex = 0;
    while((m = NUM_RE.exec(node.nodeValue))){
      if(m.index > last) frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
      const span = document.createElement('span');
      span.className = 'num';
      span.textContent = m[0];
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if(last < node.nodeValue.length) frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
  scope.querySelectorAll('[data-count]').forEach(el=>el.classList.add('num'));
}

/* ================= DATA ================= */
const PROJECTS = window.PROJECTS_LIST = [
  {
    id:'ha-web',
    badge:'Case Study',
    title:'Highly Available AWS Web Infrastructure',
    oneLiner:'A self-scaling, multi-AZ web infrastructure pattern built end-to-end on EC2.',
    tags:['EC2','ALB','Auto Scaling','Launch Templates','Security Groups'],
    cats:['aws','scaling'],
    demo:false,
    diagramType:'ha',
    overview:'The goal was to understand how to make a simple web app fault-tolerant and able to handle variable load — not just deploy one server and hope.',
    infra:['EC2 instances behind an Application Load Balancer','Target Groups routing traffic to healthy instances','Launch Templates defining consistent instance configuration','Auto Scaling Group with target-tracking scaling, spanning multiple Availability Zones','Security Groups scoping access at each layer'],
    challenges:'Getting the ALB, target group health checks, and Auto Scaling Group to actually agree with each other — and understanding what target-tracking scaling really reacts to, rather than just enabling it.',
    solution:['Built EC2-based app infrastructure across multiple AZs','Configured an ALB with a Target Group and Launch Template','Set up an Auto Scaling Group with target-tracking scaling','Secured the whole stack with Security Groups'],
    results:'A working, self-scaling, multi-AZ infrastructure pattern demonstrated end-to-end.',
    learned:'Availability isn\u2019t one setting — it\u2019s several pieces (load balancing, scaling policy, health checks, AZ spread) that all have to be configured to agree with each other.'
  },
  {
    id:'iam-ec2-s3',
    badge:'Case Study',
    title:'AWS Cloud Infrastructure — IAM, EC2 &amp; S3',
    oneLiner:'Secure, key-free EC2 → S3 access via a dedicated IAM role and trust policy.',
    tags:['IAM','EC2','S3','Trust Policies'],
    cats:['aws','security'],
    demo:false,
    diagramType:'iam',
    overview:'EC2 needed to reach S3 securely without long-term access keys, and an AssumeRole call was failing — the goal was key-free, least-privilege service-to-service access.',
    infra:['Dedicated IAM user and group with scoped permission policies','An EC2 → S3 IAM role, attached via instance profile','A trust policy defining who is allowed to assume the role'],
    challenges:'The AssumeRole call was failing — tracing that down to a trust policy misconfiguration rather than a permissions problem took real diagnosis.',
    solution:['Configured a dedicated IAM user/group and permission policies','Designed an EC2 → S3 IAM role','Diagnosed the AssumeRole failure to an incorrectly scoped Principal in the trust policy','Corrected the ARN in the trust relationship'],
    results:'Secure, key-free service-to-service access restored and verified.',
    learned:'Most IAM failures aren\u2019t about the permission policy — they\u2019re about the trust policy deciding who\u2019s even allowed to ask.'
  },
  {
    id:'static-site',
    badge:'Case Study',
    title:'Secure Static Website on AWS',
    oneLiner:'Static content served through CloudFront with a locked-down, private S3 origin.',
    tags:['S3','CloudFront','OAC','HTTPS'],
    cats:['aws','security'],
    demo:true,
    diagramType:'static',
    overview:'The goal was to serve static content securely and efficiently via a CDN, rather than exposing an S3 bucket directly to the internet.',
    infra:['S3 bucket with public access fully blocked','CloudFront distribution as the sole delivery layer','Origin Access Control (OAC) linking CloudFront to the private bucket','HTTPS enforced on all delivery'],
    challenges:'Making sure the bucket was genuinely private — reachable only through CloudFront — without breaking the origin connection in the process.',
    solution:['Created an S3 bucket with locked-down access','Configured CloudFront as the delivery layer with Origin Access Control','Enforced HTTPS-only delivery'],
    results:'Content served only through the intended CloudFront distribution, with a fully private S3 origin.',
    learned:'A CDN in front of a bucket isn\u2019t automatically secure — the origin access configuration is what actually closes the direct-access gap.'
  },
  {
    id:'packet-tracer',
    badge:'Concept Work',
    title:'Networking &amp; Infrastructure Troubleshooting',
    oneLiner:'Router/switch config, VLANs, and subnetting practiced in Cisco Packet Tracer.',
    tags:['Packet Tracer','VLANs','Subnetting','L1/L2/L3'],
    cats:['networking'],
    demo:false,
    diagramType:'net',
    overview:'The goal was to build real troubleshooting reflexes for connectivity issues — not just pass a theory quiz on OSI layers.',
    infra:['Cisco routers and switches configured in Packet Tracer','VLAN segmentation across multiple subnets','Layer 1/2/3 addressing and routing'],
    challenges:'Diagnosing connectivity failures without being told which layer the problem was on — reading MAC tables and routing tables like an actual troubleshooting session.',
    solution:['Practiced router and switch configuration','Analyzed MAC tables to trace connectivity issues','Worked through Layer 1/2/3 troubleshooting','Designed VLAN and subnetting schemes'],
    results:'Working, tested topologies with verified end-to-end connectivity.',
    learned:'Troubleshooting is a process, not a lookup — working from Layer 1 up is what actually finds the fault.'
  }
];

/* ================= RENDER PROJECT CARDS (ISOMETRIC 3D DIAGRAMS) ================= */
function diagramSVG(type){
  const line = 'rgba(255,255,255,0.16)';
  const glowFill = '#f2f2f0';
  const shade = { top:'#eeeef0', left:'#84858a', right:'#4b4c50', stroke:'rgba(255,255,255,0.16)' };
  const shadeDim = { top:'#c9cacd', left:'#68696d', right:'#3a3b3e', stroke:'rgba(255,255,255,0.12)' };

  // isometric box: (cx,cy) = center of the top rhombus, w/d = half-width/depth of top face, h = extrusion height
  const isoBox = (cx,cy,w,d,h,s=shade)=>`
    <polygon points="${cx},${cy+d} ${cx+w},${cy} ${cx+w},${cy+h} ${cx},${cy+d+h}" fill="${s.right}" stroke="${s.stroke}" stroke-width="1"/>
    <polygon points="${cx-w},${cy} ${cx},${cy+d} ${cx},${cy+d+h} ${cx-w},${cy+h}" fill="${s.left}" stroke="${s.stroke}" stroke-width="1"/>
    <polygon points="${cx-w},${cy} ${cx},${cy-d} ${cx+w},${cy} ${cx},${cy+d}" fill="${s.top}" stroke="${s.stroke}" stroke-width="1"/>
  `;
  // flat iso plane (ground / VLAN slab), no extrusion
  const isoPlane = (cx,cy,w,d,fill,opacity=0.14)=>`<polygon points="${cx-w},${cy} ${cx},${cy-d} ${cx+w},${cy} ${cx},${cy+d}" fill="${fill}" opacity="${opacity}" stroke="${line}" stroke-width="1"/>`;
  const wire = (x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${line}" stroke-width="1.2" stroke-dasharray="3 4"/>`;
  const node = (cx,cy,r=4,fill=glowFill)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${r+8}" fill="${fill}" opacity="0.14"/>`;
  const label = (x,y,txt,size=9.5,fill='#c9cad0')=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${size}" fill="${fill}">${txt}</text>`;
  const grid = `<g opacity="0.5">${[0,1,2,3,4].map(i=>`<line x1="${20+i*80}" y1="235" x2="${20+i*80-40}" y2="205" stroke="${line}" stroke-width="1"/>`).join('')}</g>`;

  let body = '', floats = [];
  if(type==='ha'){
    body = `
      ${grid}
      ${wire(96,182,190,84)}${wire(96,182,190,150)}${wire(96,182,190,216)}
      <g class="iso-float f0">${isoBox(96,168,30,15,30)}${label(96,235,'ALB')}</g>
      <g class="iso-float f1">${isoBox(214,70,28,14,26)}${node(214,50,3.5)}${label(214,116,'EC2 · AZ-a',9)}</g>
      <g class="iso-float f2">${isoBox(214,136,28,14,26)}${node(214,116,3.5)}${label(214,182,'EC2 · AZ-b',9)}</g>
      <g class="iso-float f3">${isoBox(214,202,28,14,26)}${node(214,182,3.5)}${label(214,248,'EC2 · AZ-c',9)}</g>
    `;
  } else if(type==='iam'){
    body = `
      ${grid}
      ${wire(74,168,150,150)}${wire(190,150,262,168)}
      <g class="iso-float f0">${isoBox(74,150,26,13,26)}${label(74,214,'EC2')}</g>
      <g class="iso-float f1">
        <polygon points="170,108 195,123 170,138 145,123" fill="#dcdde0" stroke="${line}" stroke-width="1"/>
        <circle cx="170" cy="120" r="5" fill="#4b4c50"/><rect x="167.5" y="120" width="5" height="8" fill="#4b4c50"/>
        ${label(170,163,'IAM Role',10,'#eceef0')}${label(170,177,'trust policy',8,'#8a8b8f')}
      </g>
      <g class="iso-float f2">${isoBox(262,150,26,13,26,shadeDim)}${label(262,214,'S3')}</g>
      ${node(150,150,3,'#7d7e82')}${node(190,150,3.5)}
    `;
  } else if(type==='static'){
    body = `
      ${grid}
      ${wire(50,178,140,168)}${wire(140,168,150,168)}${wire(190,150,270,168)}
      <g class="iso-float f0">
        <circle cx="50" cy="150" r="13" fill="#dcdde0" stroke="${line}"/>
        <circle cx="50" cy="146" r="5" fill="#0d0d0f"/><path d="M40,158 q10,-10 20,0" stroke="#0d0d0f" stroke-width="3" fill="none"/>
        ${label(50,196,'User')}
      </g>
      <g class="iso-float f1">
        <polygon points="170,120 194,134 194,158 170,172 146,158 146,134" fill="#e2e3e6" stroke="${line}" stroke-width="1"/>
        <circle cx="170" cy="146" r="10" fill="#4b4c50"/>
        ${label(170,205,'CloudFront',9.5)}${label(170,110,'HTTPS · OAC',8,'#8a8b8f')}
      </g>
      <g class="iso-float f2">${isoBox(270,150,27,13,28,shadeDim)}
        <rect x="264" y="128" width="12" height="9" rx="2" fill="none" stroke="#c9cad0" stroke-width="1.3"/>
        ${label(270,214,'S3 (private)',9)}
      </g>
      ${node(150,168,3,'#7d7e82')}
    `;
  } else {
    body = `
      ${isoPlane(230,84,58,26,'#eceef0',0.12)}${label(230,84,'VLAN 10',8.5,'#c9cad0')}
      ${isoPlane(230,192,58,26,'#eceef0',0.07)}${label(230,192,'VLAN 20',8.5,'#c9cad0')}
      ${wire(96,150,178,96)}${wire(96,150,178,150)}${wire(96,150,178,204)}
      ${wire(178,96,262,96)}${wire(178,204,262,204)}
      <g class="iso-float f0">${isoBox(96,136,26,13,26)}${label(96,198,'Router')}</g>
      <g class="iso-float f1">${isoBox(178,136,24,12,24,shadeDim)}${label(178,192,'Switch',9)}</g>
      ${node(178,96,3)}${node(178,204,3)}
    `;
  }
  return `<svg viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" style="background:radial-gradient(ellipse at 30% 15%, rgba(255,255,255,0.07), transparent 60%), #0d0d0f;">${body}</svg>`;
}

/* ================= LAYERED 3D DEPTH (shared preset) =================
   One interpolated pointer model drives card rotation and per-layer
   parallax, so Projects and Skills move with the same physics. */
const DEPTH_REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || !window.matchMedia('(hover:hover) and (pointer:fine)').matches;

function attachDepth(el, opts){
  const o = Object.assign({ tilt:5.5, lift:6, scale:1.02, follow:0.075 }, opts||{});
  const glow = el.querySelector('.glow-layer');
  if(DEPTH_REDUCE) return;

  let tx=0, ty=0, cx=0, cy=0, weight=0, tw=0, raf=null;

  function render(){
    const dx = tx-cx, dy = ty-cy, dw = tw-weight;
    const settled = Math.abs(dx)<0.01 && Math.abs(dy)<0.01 && Math.abs(dw)<0.01;
    if(settled){
      cx=tx; cy=ty; weight=tw; raf=null;
      if(tw === 0){
        el.style.transform=''; el.style.removeProperty('--px'); el.style.removeProperty('--py');
        el.classList.remove('tilt');
        return;
      }
    }else{
      cx += dx*o.follow; cy += dy*o.follow; weight += dw*o.follow;
    }
    el.style.setProperty('--px', cx.toFixed(4));
    el.style.setProperty('--py', cy.toFixed(4));
    el.style.transform =
      `perspective(1100px) rotateX(${(-cy*o.tilt*weight).toFixed(3)}deg)`+
      ` rotateY(${(cx*o.tilt*weight).toFixed(3)}deg)`+
      ` translate3d(0, ${(-o.lift*weight).toFixed(2)}px, 0)`+
      ` scale(${(1+(o.scale-1)*weight).toFixed(4)})`;
    raf = settled ? null : requestAnimationFrame(render);
  }
  function kick(){ if(!raf) raf = requestAnimationFrame(render); }

  el.addEventListener('mouseenter', ()=>{ el.classList.add('tilt'); tw = 1; kick(); });
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    if(glow){ glow.style.setProperty('--gx', x+'px'); glow.style.setProperty('--gy', y+'px'); }
    tx = (x/r.width)-0.5; ty = (y/r.height)-0.5;
    kick();
  });
  el.addEventListener('mouseleave', ()=>{ tx=0; ty=0; tw=0; kick(); });
}

/* interpolated pointer model for the extruded 3D type (hero name, wordmark):
   the object keeps following the cursor while it moves anywhere over its zone,
   lags behind it, then settles back to neutral once the pointer leaves. */
function attachType3D(el, zone, opts){
  if(DEPTH_REDUCE || !el || !zone) return;
  const o = Object.assign({ tilt:9, follow:0.055 }, opts||{});
  let tx=0, ty=0, cx=0, cy=0, weight=0, tw=0, raf=null;

  function render(){
    const dx=tx-cx, dy=ty-cy, dw=tw-weight;
    const settled = Math.abs(dx)<0.004 && Math.abs(dy)<0.004 && Math.abs(dw)<0.004;
    if(settled){
      cx=tx; cy=ty; weight=tw; raf=null;
      if(tw === 0){
        el.classList.remove('live');
        el.style.removeProperty('--px'); el.style.removeProperty('--py');
        el.style.transform='';
        return;
      }
    }else{
      cx+=dx*o.follow; cy+=dy*o.follow; weight+=dw*o.follow;
    }
    el.style.setProperty('--px', (cx*weight).toFixed(4));
    el.style.setProperty('--py', (cy*weight).toFixed(4));
    el.style.transform =
      `perspective(1000px) rotateX(${(-cy*o.tilt*weight).toFixed(3)}deg)`+
      ` rotateY(${(cx*o.tilt*weight).toFixed(3)}deg)`;
    raf = settled ? null : requestAnimationFrame(render);
  }
  const kick = ()=>{ if(!raf) raf = requestAnimationFrame(render); };

  zone.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    tx = ((e.clientX - r.left)/r.width) - 0.5;
    ty = ((e.clientY - r.top)/r.height) - 0.5;
    tx = Math.max(-1.2, Math.min(1.2, tx));
    ty = Math.max(-1.2, Math.min(1.2, ty));
    tw = 1;
    el.classList.add('live');
    kick();
  });
  zone.addEventListener('mouseleave', ()=>{ tx=0; ty=0; tw=0; kick(); });
}
attachType3D(document.getElementById('heroName'), document.getElementById('home'));
attachType3D(document.getElementById('footerWordmark'), document.querySelector('footer'), { tilt:6 });

const grid = document.getElementById('projGrid');
PROJECTS.forEach((p,i)=>{
  const el = document.createElement('div');
  el.className = 'proj-card';
  el.dataset.id = p.id;
  el.dataset.cats = p.cats.join(' ');
  el.innerHTML = `
    <div class="proj-visual">
      ${diagramSVG(p.diagramType)}
      <span class="badge ${p.badge==='Case Study'?'case':''}">${p.badge}</span>
      <div class="glow-layer"></div>
    </div>
    <div class="proj-body">
      <div class="proj-title-row">
        <h3>${p.title}</h3>
        <div class="proj-arrow" data-ico="arrow"></div>
      </div>
      <p class="proj-one-liner">${p.oneLiner}</p>
      <div class="proj-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    </div>
  `;
  grid.appendChild(el);

  attachDepth(el);
  el.addEventListener('click', ()=>{
    /* small tactile settle before the card starts expanding */
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ openModal(p.id); return; }
    el.style.transition = 'transform .18s var(--ease)';
    el.style.transform = 'scale(.988)';
    setTimeout(()=>{ el.style.transition=''; el.style.transform=''; openModal(p.id); }, 130);
  });
});

/* ================= PROJECT FILTERS ================= */
document.querySelectorAll('#projFilters .tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('#projFilters .tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card=>{
      card.hidden = f !== 'all' && !card.dataset.cats.split(' ').includes(f);
    });
  });
});

/* ================= PRINCIPLE SPOTLIGHT ================= */
(function(){
  const cards = [...document.querySelectorAll('#principlesGrid .principle-card')];
  if(!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0, paused = false;
  cards.forEach(c=>{
    c.addEventListener('mouseenter', ()=>{ paused = true; });
    c.addEventListener('mouseleave', ()=>{ paused = false; });
  });
  cards[0].classList.add('spot');
  setInterval(()=>{
    if(paused || document.hidden) return;
    cards[i].classList.remove('spot');
    i = (i+1) % cards.length;
    cards[i].classList.add('spot');
  }, 4000);
})();

/* ================= MODAL ================= */
const overlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
function openModal(id, opts){
  const p = PROJECTS.find(x=>x.id===id);
  const idx = PROJECTS.indexOf(p);
  const prevId = PROJECTS[(idx+PROJECTS.length-1)%PROJECTS.length].id;
  const nextId = PROJECTS[(idx+1)%PROJECTS.length].id;
  modalBody.scrollTop = 0;
  modalBody.innerHTML = `
    <div class="cs-topbar">
      <button class="cs-btn ghost" onclick="closeModal()" aria-label="Back to projects">← <span>Back</span></button>
      <span class="cs-title">${p.title}</span>
      <span class="cs-nav" style="display:flex; gap:8px;">
        <button class="cs-btn" onclick="openModal('${prevId}')">←<span> Prev</span></button>
        <button class="cs-btn" onclick="openModal('${nextId}')"><span>Next </span>→</button>
      </span>
    </div>
    <div class="cs-hero">
      <div class="cs-hero-visual" id="csHeroVisual">${diagramSVG(p.diagramType)}</div>
      <div class="cs-hero-meta">
        <span class="badge ${p.badge==='Case Study'?'case':''}" style="position:static; display:inline-block; margin-bottom:16px;">${p.badge}</span>
        <h2>${p.title}</h2>
        <div class="modal-sub">${p.oneLiner}</div>
        <div class="proj-tags" style="margin-bottom:6px;">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      </div>
    </div>
    <div class="cs-body">

    <div class="cs-block">
      <div class="cs-num">01 — OVERVIEW</div>
      <p>${p.overview}</p>
    </div>
    <div class="cs-block">
      <div class="cs-num">02 — ARCHITECTURE</div>
      <div style="border-radius:12px; overflow:hidden; border:1px solid var(--line);">${diagramSVG(p.diagramType)}</div>
    </div>
    <div class="cs-block">
      <div class="cs-num">03 — INFRASTRUCTURE</div>
      <ul>${p.infra.map(i=>`<li>${i}</li>`).join('')}</ul>
    </div>
    <div class="cs-block">
      <div class="cs-num">05 — CHALLENGES</div>
      <p>${p.challenges}</p>
    </div>
    <div class="cs-block">
      <div class="cs-num">06 — SOLUTION</div>
      <ul>${p.solution.map(s=>`<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="cs-block">
      <div class="cs-num">07 — RESULTS</div>
      <p>${p.results}</p>
    </div>
    <div class="cs-block">
      <div class="cs-num">08 — WHAT I LEARNED</div>
      <p>${p.learned}</p>
    </div>
    ${window.projectExtraHTML ? window.projectExtraHTML(p.id) : ''}
    <div class="modal-footer">
      <div style="display:flex; gap:10px;">
        
        ${p.demo ? '<span class="btn-secondary" style="cursor:not-allowed; opacity:.7;">Live Demo</span>' : ''}
      </div>
      <div style="display:flex; gap:10px;">
        <span class="btn-secondary" style="cursor:pointer;" onclick="openModal('${prevId}')">← Prev</span>
        <span class="btn-secondary" style="cursor:pointer;" onclick="openModal('${nextId}')">Next Project →</span>
      </div>
    </div>
    </div>
  `;
  mountIcons(modalBody);
  mountNumbers(modalBody);

  const wasOpen = overlay.classList.contains('open');
  overlay.classList.add('open');
  document.body.classList.add('cs-open');
  document.body.style.overflow='hidden';
  currentProject = id;

  if(!wasOpen) flyFromCard(id);
  if(!(opts && opts.fromHistory)){
    const url = '#project/'+id;
    if(wasOpen) history.replaceState({project:id}, '', url);
    else history.pushState({project:id}, '', url);
  }
}

/* shared-element flight: the card visual becomes the case-study header */
const csReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function flyFromCard(id){
  if(csReduce) return;
  const card = document.querySelector(`.proj-card[data-id="${id}"] .proj-visual`);
  const target = document.getElementById('csHeroVisual');
  if(!card || !target || !card.getClientRects().length) return;

  const from = card.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'cs-ghost';
  ghost.innerHTML = card.querySelector('svg')?.outerHTML || '';
  ghost.style.left = to.left+'px';
  ghost.style.top = to.top+'px';
  ghost.style.width = to.width+'px';
  ghost.style.height = to.height+'px';
  document.body.appendChild(ghost);
  target.style.opacity = '0';

  const sx = from.width / to.width, sy = from.height / to.height;
  const anim = ghost.animate([
    { transform:`translate(${from.left-to.left}px, ${from.top-to.top}px) scale(${sx}, ${sy})`, borderRadius:'16px', opacity:.92 },
    { transform:'none', borderRadius:'0px', opacity:1 }
  ], { duration:950, easing:'cubic-bezier(.16,.84,.28,1)' });
  anim.onfinish = ()=>{ target.style.opacity=''; ghost.remove(); };
}

/* reverse flight back into the originating card */
function flyToCard(id, done){
  const card = id && document.querySelector(`.proj-card[data-id="${id}"] .proj-visual`);
  const source = document.getElementById('csHeroVisual');
  if(csReduce || !card || !source || !card.getClientRects().length){ done(); return; }

  const to = card.getBoundingClientRect();
  const from = source.getBoundingClientRect();
  if(to.bottom < 0 || to.top > window.innerHeight){ done(); return; }

  const ghost = document.createElement('div');
  ghost.className = 'cs-ghost';
  ghost.innerHTML = source.querySelector('svg')?.outerHTML || '';
  ghost.style.left = from.left+'px';
  ghost.style.top = from.top+'px';
  ghost.style.width = from.width+'px';
  ghost.style.height = from.height+'px';
  document.body.appendChild(ghost);
  source.style.opacity = '0';
  done();

  const sx = to.width / from.width, sy = to.height / from.height;
  const anim = ghost.animate([
    { transform:'none', borderRadius:'0px', opacity:1 },
    { transform:`translate(${to.left-from.left}px, ${to.top-from.top}px) scale(${sx}, ${sy})`, borderRadius:'16px', opacity:0 }
  ], { duration:780, easing:'cubic-bezier(.16,.84,.28,1)' });
  anim.onfinish = ()=> ghost.remove();
}

let currentProject = null;
function closeModal(opts){
  if(!overlay.classList.contains('open')) return;
  const id = currentProject;
  flyToCard(id, ()=>{
    overlay.classList.remove('open');
    document.body.classList.remove('cs-open');
    document.body.style.overflow='';
  });
  currentProject = null;
  if(!(opts && opts.fromHistory) && location.hash.startsWith('#project/')) history.back();
}
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

/* route-based navigation: #project/<id> keeps Back working naturally */
window.addEventListener('popstate', ()=>{
  const m = location.hash.match(/^#project\/(.+)$/);
  if(m && PROJECTS.some(p=>p.id===m[1])) openModal(m[1], {fromHistory:true});
  else closeModal({fromHistory:true});
});
(function(){
  const m = location.hash.match(/^#project\/(.+)$/);
  if(m && PROJECTS.some(p=>p.id===m[1])) openModal(m[1], {fromHistory:true});
})();

/* ================= SKILLS TABS ================= */
document.querySelectorAll('#tabs .tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('#tabs .tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.skill-panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
  });
});

/* mount all data-ico placeholders (static markup + rendered project cards) */
mountIcons(document);
mountBrands(document);
document.querySelectorAll('.tool-card').forEach(c=> attachDepth(c, { tilt:4, lift:5, scale:1.015 }));
document.querySelectorAll('.stat-card, .principle-card, .card').forEach(c=> attachDepth(c, { tilt:2.4, lift:3, scale:1.006, follow:0.06 }));

/* ================= TAB KEYBOARD ACTIVATION ================= */
document.querySelectorAll('.tab[role="button"]').forEach(tab=>{
  tab.addEventListener('keydown', e=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tab.click(); }
  });
});

/* ================= SKILL CHIP ICONS + ACTIVE STATE ================= */
(function(){
  const byLevel = { 'hands-on':'check', 'learning':'spark', 'fundamentals':'book' };
  const byName = [
    [/github/i,'github'], [/\bgit\b/i,'git'], [/docker|container/i,'docker'], [/kubernetes|k8s/i,'kubernetes'],
    [/terraform/i,'terraform'], [/python/i,'python'], [/linux|sysadmin/i,'linux'], [/cli|shell|bash/i,'bash'],
    [/cisco|packet tracer/i,'cisco'], [/iam|polic|role|trust/i,'iam'],
    [/ec2|s3|cloudfront|ebs|aws|auto scaling|launch template|alb|target group|security group/i,'aws'],
    [/routing|switch|vlan|subnet|ip |tcp|nat|acl|mac|network|troubleshoot/i,'network']
  ];
  document.querySelectorAll('.skill-chip').forEach(chip=>{
    attachDepth(chip, { tilt:3.2, lift:3, scale:1.012 });
    const level = chip.querySelector('.level');
    const key = level && [...level.classList].find(c=>byLevel[c]);
    const name = (chip.querySelector('.name')?.textContent || '');
    const brandKey = (byName.find(([re])=>re.test(name))||[])[1];
    const badge = document.createElement('span');
    if(brandKey){
      badge.className = 'brand-wrap sm';
      badge.innerHTML = brandSVG(brandKey, 'brand-sm');
      chip.style.setProperty('--brand-tint', BRANDS[brandKey].tint);
    }else{
      badge.className = 'ico-badge sm';
      badge.innerHTML = svgIco(byLevel[key] || 'check', 'ico-sm');
    }
    chip.insertBefore(badge, chip.firstChild);
    chip.setAttribute('tabindex','0');
    chip.setAttribute('role','button');
    const toggle = ()=>{
      const panel = chip.closest('.skill-panel');
      const on = chip.classList.contains('is-active');
      if(panel) panel.querySelectorAll('.skill-chip.is-active').forEach(c=>c.classList.remove('is-active'));
      chip.classList.toggle('is-active', !on);
    };
    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
  });
  document.querySelectorAll('.tool-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const on = card.classList.contains('is-active');
      document.querySelectorAll('.tool-card.is-active').forEach(c=>c.classList.remove('is-active'));
      card.classList.toggle('is-active', !on);
    });
  });
})();

/* ================= THEME TOGGLE ================= */
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if(saved !== 'light') root.setAttribute('data-theme','dark');
  btn.addEventListener('click', ()=>{
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){ root.removeAttribute('data-theme'); localStorage.setItem('theme','light'); }
    else{ root.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); }
  });
})();

/* ================= LANGUAGE TOGGLE (EN / AR) ================= */
const I18N = {
  en:{
    'nav.home':'Home','nav.about':'About','nav.education':'Education','nav.skills':'Skills','nav.projects':'Projects','nav.contact':'Contact','nav.cta':"Let's Connect",
    'hero.greet':"Hello, I'm",'hero.role':'Aspiring Infrastructure &amp; Platform Engineer',
    'hero.usp':'Building secure, scalable cloud infrastructure through AWS, networking, Linux, and DevOps.',
    'hero.viewWork':'View my work','hero.downloadCv':'Download CV','hero.viewGithub':'View GitHub',
    'hero.comingSoon':'Coming soon — still building this out.',
    'hero.stat1':'Hands-on projects','hero.stat2':'Expected graduation','hero.stat3':'GPA / 4.0',
    'hero.stat1d':'Networking, Linux, AWS and automation labs built end-to-end.',
    'hero.stat2d':'B.Sc. Communications &amp; Electronics Engineering, Horus University.',
    'hero.stat3d':'Final year, kept alongside continuous hands-on self-study.',
    'hero.available':'Available for projects','hero.location':'Tanta, Egypt','hero.scroll':'SCROLL',
    'about.eyebrow':'About','about.h2':'From communications engineering to infrastructure',
    'about.p1':"I’m Serag, a Cloud &amp; DevOps enthusiast focused on infrastructure, automation, and reliable systems.",
    'about.p2':"I like understanding problems from the root, building practical solutions, and automating repetitive work. My interests span Linux, networking, cloud, containers, and DevOps — with a strong focus on learning through hands-on projects.",
    'about.p3':"Understand. Build. Automate. Improve.",
    'about.tagContainers':'Containers',
    'about.j1b':'Communications &amp; Electronics Engineering','about.j1s':'2022',
    'about.j2b':'Networking','about.j2s':'Routing, switching, subnetting, Packet Tracer',
    'about.j3b':'Linux','about.j3s':'CLI, fundamentals, basic sysadmin',
    'about.j4b':'AWS Cloud','about.j4s':'IAM, EC2, S3, CloudFront, ALB, Auto Scaling',
    'about.j5b':'Infrastructure &amp; DevOps','about.j5s':'DEPI track — 2026, in progress',
    'about.j6b':'Next: Automation &amp; Platform Engineering','about.j6s':'Where this is heading',
    'edu.eyebrow':'Education','edu.h2':'Education &amp; current training',
    'edu.c1h3':'Bachelor of Communications &amp; Electronics Engineering','edu.c1meta':'Horus University, New Damietta, Egypt',
    'edu.duration':'Duration','edu.durationVal':'Aug 2022 – Expected May 2027','edu.gpa':'GPA','edu.status':'Status','edu.statusVal':'Final year',
    'edu.c2h3':'Currently Training','edu.c2meta':'No completed certificate to link yet — training in progress, shown honestly rather than as a claimed certification.',
    'edu.t1b':'DEPI — DevOps Track','edu.t1s':'Digital Egypt Pioneers Initiative · In Progress',
    'edu.t2b':'CCNA — Routing &amp; Switching Fundamentals','edu.t2s':'Self-Study',
    'skills.eyebrow':'Skills','skills.h2':"Tools I've actually put my hands on",
    'skills.tab1':'Cloud &amp; AWS','skills.tab2':'Networking','skills.tab3':'Linux','skills.tab4':'DevOps','skills.tab5':'Tools',
    'skills.currentlyLearning':'CURRENTLY LEARNING','skills.learningDetail':'DEPI DevOps track and CCNA routing &amp; switching — see Education for details.',
    'principles.eyebrow':'How I work','principles.h2':'Fix the root cause, not the symptom',
    'principles.p1h':'Diagnose before touching anything','principles.p1p':'Read the logs, the policy, the routing table. A change made before the fault is understood is just a second problem.',
    'principles.p2h':'Design so it survives failure','principles.p2p':'Health checks, multi-AZ spread, least-privilege boundaries — reliability is decided at setup time, not during the incident.',
    'principles.p3h':'Automate and write it down','principles.p3p':"If a fix only lives in my terminal history, it isn't finished. Repeatable steps and clear notes come with the work.",
    'principles.p4h':'Verify, then hand off clean','principles.p4p':'Prove the fix with a test you can repeat, then leave the setup understandable to whoever owns it next.',
    'tools.handsOn':'Hands-on','tools.learning':'Learning','tools.networking':'Networking',
    'proj.eyebrow':'Projects','proj.h2':'Self-directed, hands-on infrastructure work',
    'proj.fAll':'All','proj.fNet':'Networking','proj.fSec':'Security','proj.fScale':'Scaling',
    'proj.lede':"No professional experience yet — so here's the Challenge → Action → Result behind four real, hands-on builds instead.",
    'services.eyebrow':'Services','services.h2':'Where I can help, while still early-career',
    'services.s1h':'AWS Access &amp; IAM Troubleshooting','services.s1p':'Root-causing broken role/policy access instead of patching around it — for small teams that need it fixed properly.',
    'services.s2h':'Cloud Architecture Review','services.s2p':'A second pair of eyes on a small AWS setup — security groups, IAM boundaries, and basic cost/availability sanity checks.',
    'services.s3h':'Basic Infrastructure Setup','services.s3p':"Getting a lean team's first EC2/S3/CloudFront setup running securely, from scratch.",
    'contact.eyebrow':'Contact','contact.h2':"Let's build better infrastructure.",
    'contact.lede':"Interested in cloud infrastructure, DevOps, networking, or engineering projects? Let's connect.",
    'contact.name':'Name','contact.namePh':'Your name','contact.nameErr':'Enter your name.',
    'contact.email':'Email','contact.emailErr':'Enter a valid email.',
    'contact.linkedin':'Connect on LinkedIn',
    'contact.subject':'Subject','contact.subjectPh':"What's this about?",'contact.subjectErr':'Enter a subject.',
    'contact.message':'Message','contact.messagePh':'Tell me a bit more…','contact.messageErr':'Enter a message.',
    'contact.send':'Send message',
    'contact.cardTitle':'Available for opportunities','contact.cardSub':'Open to internships &amp; entry-level infrastructure roles',
    'contact.cardEmail':'Email','contact.cardLocation':'Location',
    'footer.tagline':'Infrastructure • Cloud • DevOps','footer.pages':'PAGES','footer.contact':'CONTACT',
    'footer.copy':'© 2026 Serag Mohamed Abdelkareem Abotaleb','footer.built':'Built with intention, still in progress.'
  },
  ar:{
    'nav.home':'الرئيسية','nav.about':'نبذة','nav.education':'التعليم','nav.skills':'المهارات','nav.projects':'المشاريع','nav.contact':'تواصل','nav.cta':'تواصل معي',
    'hero.greet':'أهلاً، أنا','hero.role':'مهندس بنية تحتية ومنصات طموح',
    'hero.usp':'بناء بنية تحتية سحابية آمنة وقابلة للتوسّع عبر AWS والشبكات ولينكس وDevOps.',
    'hero.viewWork':'شاهد أعمالي','hero.downloadCv':'تحميل السيرة الذاتية','hero.viewGithub':'زيارة GitHub',
    'hero.comingSoon':'قريباً — لسه بجهزها.',
    'hero.stat1':'مشاريع عملية','hero.stat2':'التخرج المتوقع','hero.stat3':'المعدل التراكمي / 4.0',
    'hero.stat1d':'معامل شبكات ولينكس وAWS وأتمتة متبنية من الأول للآخر.',
    'hero.stat2d':'بكالوريوس هندسة الاتصالات والإلكترونيات، جامعة حورس.',
    'hero.stat3d':'السنة الأخيرة، مع دراسة ذاتية عملية مستمرة.',
    'hero.available':'متاح لمشاريع جديدة','hero.location':'طنطا، مصر','hero.scroll':'مرّر لأسفل',
    'about.eyebrow':'نبذة','about.h2':'من هندسة الاتصالات إلى البنية التحتية',
    'about.p1':'أنا سراج، مهتم بالـ Cloud وDevOps ومركّز على البنية التحتية والأتمتة والأنظمة الموثوقة.',
    'about.p2':'بحب أفهم المشاكل من جذورها، وأبني حلول عملية، وأأتمت الشغل المتكرر. اهتماماتي بتشمل لينكس والشبكات والسحابة والحاويات وDevOps — مع تركيز كبير على التعلّم من خلال مشاريع عملية.',
    'about.p3':'افهم. ابنِ. أتمِت. طوّر.',
    'about.tagContainers':'الحاويات',
    'about.j1b':'هندسة الاتصالات والإلكترونيات','about.j1s':'2022',
    'about.j2b':'الشبكات','about.j2s':'التوجيه، التبديل، Subnetting، Packet Tracer',
    'about.j3b':'لينكس','about.j3s':'أوامر CLI، الأساسيات، إدارة نظام مبدئية',
    'about.j4b':'حوسبة AWS السحابية','about.j4s':'IAM, EC2, S3, CloudFront, ALB, Auto Scaling',
    'about.j5b':'البنية التحتية وDevOps','about.j5s':'مسار DEPI — 2026، جارٍ حالياً',
    'about.j6b':'التالي: الأتمتة وهندسة المنصات','about.j6s':'الاتجاه القادم',
    'edu.eyebrow':'التعليم','edu.h2':'التعليم والتدريب الحالي',
    'edu.c1h3':'بكالوريوس هندسة الاتصالات والإلكترونيات','edu.c1meta':'جامعة حورس، دمياط الجديدة، مصر',
    'edu.duration':'المدة','edu.durationVal':'أغسطس 2022 – مايو 2027 (متوقع)','edu.gpa':'المعدل','edu.status':'الحالة','edu.statusVal':'السنة الأخيرة',
    'edu.c2h3':'تدريب حالي','edu.c2meta':'مفيش شهادة متمّة أعرضها لحد دلوقتي — التدريب لسه شغّال، وبعرض ده بصراحة بدل ما أدّعي شهادة.',
    'edu.t1b':'DEPI — مسار DevOps','edu.t1s':'مبادرة رواد مصر الرقمية · جارٍ حالياً',
    'edu.t2b':'CCNA — أساسيات التوجيه والتبديل','edu.t2s':'دراسة ذاتية',
    'skills.eyebrow':'المهارات','skills.h2':'أدوات اشتغلت بيها فعلاً',
    'skills.tab1':'السحابة وAWS','skills.tab2':'الشبكات','skills.tab3':'لينكس','skills.tab4':'DevOps','skills.tab5':'أدوات',
    'skills.currentlyLearning':'بتعلم دلوقتي','skills.learningDetail':'مسار DEPI في DevOps وCCNA للتوجيه والتبديل — التفاصيل في قسم التعليم.',
    'principles.eyebrow':'طريقتي في الشغل','principles.h2':'أصلح السبب الحقيقي، مش العَرَض',
    'principles.p1h':'التشخيص قبل أي تعديل','principles.p1p':'أقرأ الـ logs والصلاحيات وجدول التوجيه الأول. أي تغيير قبل فهم العطل بيتحوّل لمشكلة تانية.',
    'principles.p2h':'تصميم يتحمّل الأعطال','principles.p2p':'Health checks وتوزيع على أكتر من AZ وحدود صلاحيات ضيّقة — الاعتمادية بتتقرر وقت الإعداد، مش وقت العطل.',
    'principles.p3h':'أتمتة وتوثيق','principles.p3p':'لو الحل عايش في الـ terminal بتاعي بس، يبقى لسه مخلصش. خطوات قابلة للتكرار وملاحظات واضحة جزء من الشغل.',
    'principles.p4h':'تأكيد النتيجة وتسليم نظيف','principles.p4p':'أثبت الإصلاح باختبار أقدر أعيده، وأسيب الإعداد مفهوم لأي حد هيمسكه بعدي.',
    'tools.handsOn':'خبرة عملية','tools.learning':'قيد التعلّم','tools.networking':'الشبكات',
    'proj.eyebrow':'المشاريع','proj.h2':'مشاريع بنية تحتية عملية وذاتية التوجيه',
    'proj.fAll':'الكل','proj.fNet':'الشبكات','proj.fSec':'الأمان','proj.fScale':'التوسّع',
    'proj.lede':'لسه معنديش خبرة مهنية رسمية — فده بدلها: التحدي ← الإجراء ← النتيجة لأربع مشاريع حقيقية اشتغلت عليها بنفسي.',
    'services.eyebrow':'الخدمات','services.h2':'فين أقدر أساعد، حتى في بداية مشواري',
    'services.s1h':'حل مشاكل الوصول وIAM في AWS','services.s1p':'تشخيص السبب الحقيقي لمشاكل الأدوار والصلاحيات بدل ما نرقّعها — لفرق صغيرة عايزة حل نهائي.',
    'services.s2h':'مراجعة معمارية سحابية','services.s2p':'نظرة تانية على إعداد AWS بسيط — مجموعات الأمان، حدود IAM، وفحص أساسي للتكلفة والتوافر.',
    'services.s3h':'إعداد بنية تحتية أساسية','services.s3p':'تجهيز أول إعداد EC2/S3/CloudFront لفريق صغير بشكل آمن، من الصفر.',
    'contact.eyebrow':'تواصل','contact.h2':'خلّينا نبني بنية تحتية أفضل.',
    'contact.lede':'مهتم ببنية تحتية سحابية أو DevOps أو شبكات أو مشاريع هندسية؟ يلا نتكلم.',
    'contact.name':'الاسم','contact.namePh':'اسمك','contact.nameErr':'من فضلك اكتب اسمك.',
    'contact.email':'البريد الإلكتروني','contact.emailErr':'اكتب بريد إلكتروني صحيح.',
    'contact.linkedin':'تواصل عبر LinkedIn',
    'contact.subject':'الموضوع','contact.subjectPh':'الموضوع عن إيه؟','contact.subjectErr':'من فضلك اكتب الموضوع.',
    'contact.message':'الرسالة','contact.messagePh':'قول لي تفاصيل أكتر…','contact.messageErr':'من فضلك اكتب رسالة.',
    'contact.send':'إرسال الرسالة',
    'contact.cardTitle':'متاح لفرص جديدة','contact.cardSub':'مفتوح للتدريب والوظائف المبتدئة في البنية التحتية',
    'contact.cardEmail':'البريد الإلكتروني','contact.cardLocation':'الموقع',
    'footer.tagline':'بنية تحتية • سحابة • DevOps','footer.pages':'الصفحات','footer.contact':'تواصل',
    'footer.copy':'© 2026 سراج محمد عبدالكريم أبوطالب','footer.built':'اتبنى بنيّة، ولسه شغال عليه.'
  }
};
(function(){
  const langBtn = document.getElementById('langToggle');
  let lang = localStorage.getItem('lang') || 'en';
  if(window.CONTENT_I18N){
    Object.keys(window.CONTENT_I18N).forEach(k=>Object.assign(I18N[k], window.CONTENT_I18N[k]));
  }
  function apply(){
    if(typeof window.renderContent === 'function') window.renderContent(lang);
    const dict = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
      const key = el.getAttribute('data-i18n-ph');
      if(dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
    langBtn.textContent = lang === 'en' ? 'AR' : 'EN';
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    mountNumbers(document.body);
  }
  apply();
  langBtn.addEventListener('click', ()=>{
    lang = lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', lang);
    apply();
  });
})();

mountNumbers(document.body);

/* ================= NAVBAR SHRINK ================= */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('shrink', window.scrollY > 60);
  const hint = document.getElementById('scrollHint');
  if(hint) hint.style.opacity = window.scrollY > 80 ? '0' : '1';
}, {passive:true});

/* ================= SCROLL REVEAL ================= */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('[data-stagger]').forEach(group=>{
  // stagger groups animate their own children in sequence
  const groupReveals = group.classList.contains('reveal');
  [...group.children].forEach((child,i)=>{
    child.style.transitionDelay = (i*110)+'ms';
    if(groupReveals && !child.classList.contains('reveal')) child.classList.add('reveal');
  });
  if(groupReveals){
    group.classList.remove('reveal');
    group.classList.add('in');
  }
});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ================= ANIMATED NUMBERS ================= */
(function(){
  const nums = [...document.querySelectorAll('[data-count]')];
  if(!nums.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);

  function run(el){
    const to = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.countDecimals || '0', 10);
    const from = parseFloat(el.dataset.countFrom || '0');
    if(reduce){ el.textContent = to.toFixed(dec); return; }
    const dur = 1100, t0 = performance.now();
    function step(now){
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = (from + (to - from) * ease(t)).toFixed(dec);
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ run(e.target); obs.unobserve(e.target); } });
  }, {threshold:0.6});
  nums.forEach(n=>obs.observe(n));
})();

/* ================= WEIGHTED ANCHOR SCROLL ================= */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easeInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(!id || id === '#' || id.startsWith('#project/')) return;
      const el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      const to = Math.round(el.getBoundingClientRect().top + window.scrollY - 74);
      if(reduce.matches){ window.scrollTo(0, to); history.replaceState(null,'',id); return; }
      const from = window.scrollY, dist = to - from, dur = Math.min(1400, 620 + Math.abs(dist)*0.28);
      const t0 = performance.now();
      (function step(now){
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo({ top: from + dist*easeInOut(t), behavior:'instant' });
        if(t < 1) requestAnimationFrame(step);
        else history.replaceState(null, '', id);
      })(t0);
    });
  });
})();

/* ================= WEIGHTED WHEEL SCROLL ================= */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduce.matches) return;
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const SENSITIVITY = 0.62;   // damped wheel response
  const SMOOTH = 0.085;       // inertia / deceleration
  let target = window.scrollY, current = window.scrollY, running = false, active = false;

  function maxScroll(){ return document.documentElement.scrollHeight - window.innerHeight; }

  function frame(){
    const diff = target - current;
    if(Math.abs(diff) < 0.4){ current = target; running = false; active = false; return; }
    current += diff * SMOOTH;
    window.scrollTo({ top:current, behavior:'instant' });
    requestAnimationFrame(frame);
  }

  window.addEventListener('wheel', e=>{
    if(document.body.classList.contains('cs-open')) return;
    if(e.ctrlKey || e.defaultPrevented) return;
    if(e.target.closest && e.target.closest('.modal')) return;
    e.preventDefault();
    if(!active){ current = window.scrollY; target = current; active = true; }
    target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * SENSITIVITY));
    if(!running){ running = true; requestAnimationFrame(frame); }
  }, { passive:false });

  window.addEventListener('resize', ()=>{ active = false; }, { passive:true });
  ['keydown','mousedown','touchstart'].forEach(ev=>
    window.addEventListener(ev, ()=>{ active = false; }, { passive:true })
  );
})();

/* ================= MAGNETIC CTA ================= */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn-primary, .cta-btn').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / r.width;
      const y = (e.clientY - r.top - r.height/2) / r.height;
      btn.style.transform = `translate(${(x*7).toFixed(2)}px, ${(y*5).toFixed(2)}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
  });
})();

/* ================= SCROLL-DRAWN JOURNEY TIMELINE ================= */
(function(){
  const journey = document.getElementById('journey');
  const line = document.getElementById('journeyProgress');
  if(!journey || !line) return;
  const items = [...journey.querySelectorAll('.journey-item')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function update(){
    ticking = false;
    const r = journey.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 → 1 as the list travels up through the reading line
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / Math.max(vh * 0.2 + r.height, 1)));
    const drawn = reduce ? 1 : p;
    line.style.transform = `scaleY(${drawn})`;
    const trackTop = r.top + 34;
    const reach = trackTop + Math.max(r.height - 68, 0) * drawn;
    items.forEach(it=>{
      const dot = it.getBoundingClientRect().top + 10;
      it.classList.toggle('reached', reduce || dot <= reach + 6);
    });
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
  window.addEventListener('resize', update, { passive:true });
  update();
})();

/* ================= SLIDING TAB INDICATOR ================= */
(function(){
  document.querySelectorAll('.tabs').forEach(group=>{
    const ind = document.createElement('span');
    ind.className = 'tab-ind';
    group.appendChild(ind);

    function place(){
      const active = group.querySelector('.tab.active');
      if(!active){ ind.style.opacity = '0'; return; }
      const g = group.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      ind.style.width  = a.width + 'px';
      ind.style.height = a.height + 'px';
      ind.style.transform = `translate(${a.left - g.left}px, ${a.top - g.top}px)`;
      ind.style.opacity = '1';
      group.classList.add('ind-ready');
    }

    requestAnimationFrame(place);
    group.addEventListener('click', ()=>requestAnimationFrame(place));
    group.addEventListener('keyup', ()=>requestAnimationFrame(place));
    window.addEventListener('resize', ()=>requestAnimationFrame(place), { passive:true });
    document.getElementById('langToggle')?.addEventListener('click', ()=>setTimeout(place, 60));
    document.fonts?.ready.then(place);
  });
})();

/* ================= CUSTOM CURSOR ================= */
const cursor = document.getElementById('cursor');
const isTouch = window.matchMedia('(hover: none)').matches;
if(!isTouch){
  window.addEventListener('mousemove', e=>{
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
  });
  document.querySelectorAll('.proj-card').forEach(c=>{
    c.addEventListener('mouseenter', ()=> cursor.classList.add('view'));
    c.addEventListener('mouseleave', ()=> cursor.classList.remove('view'));
  });
  document.querySelectorAll('.tab, .tool-card, .skill-chip').forEach(c=>{
    c.addEventListener('mouseenter', ()=> cursor.classList.add('touch'));
    c.addEventListener('mouseleave', ()=> cursor.classList.remove('touch'));
  });
}

/* ================= HERO PHOTO PARALLAX ================= */
const heroPhoto = document.getElementById('heroPhoto');
const heroImg = heroPhoto && heroPhoto.querySelector('img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(heroImg && !reduceMotion && !isTouch){
  document.querySelector('.hero').addEventListener('mousemove', e=>{
    const r = heroPhoto.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    heroImg.style.transform = `scale(1.06) translate(${(-dx*10).toFixed(1)}px, ${(-dy*10).toFixed(1)}px)`;
  });
}

/* ================= GLOBAL STARFIELD / CONSTELLATION BACKGROUND ================= */
(function(){
  const canvas = document.getElementById('wireframe-canvas');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DENSITY = 1/32000;          // stars per css px² — sparse, constant everywhere
  const MAX_LINK = 168;             // css px
  const PARALLAX = 26;              // css px of mouse parallax
  const SCROLL_DRIFT = 0.06;        // background moves far slower than content

  let dpr = 1, W = 0, H = 0, stars = [];
  let mx = 0.5, my = 0.5, px = 0, py = 0;
  let pointerX = -9999, pointerY = -9999;

  function size(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed(){
    const target = Math.round(W * H * DENSITY);
    stars = [];
    for(let i = 0; i < target; i++){
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.045,
        vy: (Math.random() - 0.5) * 0.045,
        r: Math.random() * 0.9 + 0.7,
        depth: 0.5 + Math.random() * 0.5,   // parallax depth
        glow: Math.random() < 0.34,          // only some stars carry a halo
        ox: 0, oy: 0                         // cursor displacement
      });
    }
  }

  size(); seed();

  let resizeT;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeT);
    resizeT = setTimeout(()=>{
      const prev = { w: W, h: H };
      size();
      // keep the field continuous instead of restarting it
      stars.forEach(s=>{ s.x = s.x / prev.w * W; s.y = s.y / prev.h * H; });
      const target = Math.round(W * H * DENSITY);
      while(stars.length > target) stars.pop();
      while(stars.length < target) stars.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.045, vy:(Math.random()-0.5)*0.045,
        r: Math.random()*0.9+0.7, depth:0.5+Math.random()*0.5,
        glow: Math.random()<0.34, ox:0, oy:0
      });
    }, 180);
  }, { passive:true });

  window.addEventListener('mousemove', e=>{
    mx = e.clientX / W; my = e.clientY / H;
    pointerX = e.clientX; pointerY = e.clientY;
  }, { passive:true });
  window.addEventListener('mouseleave', ()=>{ pointerX = pointerY = -9999; });

  // pre-rendered halo so no gradient is rebuilt per star per frame
  let haloCache = { key:'', cv:null };
  function haloSprite(rgb, isDark){
    const key = rgb + (isDark ? 'd' : 'l');
    if(haloCache.key === key) return haloCache.cv;
    const s = 24 * (Math.min(devicePixelRatio || 1, 2));
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const c = cv.getContext('2d');
    const g = c.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    g.addColorStop(0, `rgba(${rgb},${isDark ? 0.13 : 0.08})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    haloCache = { key, cv };
    return cv;
  }

  function frame(){
    ctx.clearRect(0, 0, W, H);

    if(!reduce){
      px += ((mx - 0.5) - px) * 0.035;
      py += ((my - 0.5) - py) * 0.035;
    }
    const scrollShift = reduce ? 0 : (window.scrollY || 0) * SCROLL_DRIFT;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const rgb = isDark ? '246,246,244' : '18,18,18';
    const lineAlpha = isDark ? 0.085 : 0.06;
    const dotAlpha  = isDark ? 0.62 : 0.42;

    for(const s of stars){
      if(!reduce){ s.x += s.vx; s.y += s.vy; }
      if(s.x < -20) s.x = W + 20; else if(s.x > W + 20) s.x = -20;
      if(s.y < -20) s.y = H + 20; else if(s.y > H + 20) s.y = -20;

      // understated cursor repulsion
      const sx = s.x + px * PARALLAX * s.depth;
      const sy = s.y + py * PARALLAX * s.depth - (scrollShift % (H + 40));
      const dx = sx - pointerX, dy = sy - pointerY;
      const d2 = dx*dx + dy*dy;
      let tx = 0, ty = 0;
      if(!reduce && d2 < 16900){
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 130) * 9;
        tx = dx / d * f; ty = dy / d * f;
      }
      s.ox += (tx - s.ox) * 0.08;
      s.oy += (ty - s.oy) * 0.08;
      s.sx = sx + s.ox;
      s.sy = ((sy + s.oy) % (H + 40) + (H + 40)) % (H + 40) - 20;
    }

    ctx.lineWidth = 1;
    for(let i = 0; i < stars.length; i++){
      const a = stars[i];
      for(let j = i + 1; j < stars.length; j++){
        const b = stars[j];
        const dx = a.sx - b.sx, dy = a.sy - b.sy;
        if(Math.abs(dx) > MAX_LINK || Math.abs(dy) > MAX_LINK) continue;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < MAX_LINK){
          ctx.strokeStyle = `rgba(${rgb},${lineAlpha * (1 - dist / MAX_LINK)})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
    }

    const halo = haloSprite(rgb, isDark);
    for(const s of stars){
      if(s.glow) ctx.drawImage(halo, s.sx - 12, s.sy - 12, 24, 24);
      ctx.fillStyle = `rgba(${rgb},${dotAlpha})`;
      ctx.beginPath(); ctx.arc(s.sx, s.sy, s.r, 0, Math.PI*2); ctx.fill();
    }

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ================= CONTACT FORM ================= */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const status = document.getElementById('formStatus');
function validateField(field, input, test){
  const ok = test(input.value.trim());
  field.classList.toggle('err', !ok);
  return ok;
}
['name','email','subject','message'].forEach(name=>{
  const input = form.querySelector(`[name="${name}"]`);
  const field = document.getElementById('f-'+name);
  input.addEventListener('blur', ()=>{
    if(name==='email') validateField(field, input, v=>/^\S+@\S+\.\S+$/.test(v));
    else validateField(field, input, v=>v.length>0);
  });
});
form.addEventListener('submit', e=>{
  e.preventDefault();
  let allOk = true;
  ['name','email','subject','message'].forEach(name=>{
    const input = form.querySelector(`[name="${name}"]`);
    const field = document.getElementById('f-'+name);
    const ok = name==='email' ? /^\S+@\S+\.\S+$/.test(input.value.trim()) : input.value.trim().length>0;
    field.classList.toggle('err', !ok);
    if(!ok) allOk = false;
  });
  if(!allOk){ status.textContent=''; return; }
  submitBtn.classList.add('loading');
  status.textContent = '';
  const endpoint = (C.site||{}).formEndpoint;
  const data = Object.fromEntries(new FormData(form));
  if(!endpoint){
    submitBtn.classList.remove('loading');
    location.href = `mailto:${C.site.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message+'\n\n— '+data.name+' <'+data.email+'>')}`;
    status.textContent = 'Opening your mail app…';
    return;
  }
  fetch(endpoint, { method:'POST', headers:{ 'Accept':'application/json' }, body:new FormData(form) })
    .then(r=>{ if(!r.ok) throw new Error(r.status); status.textContent = "Thanks — I'll get back to you soon."; form.reset(); })
    .catch(()=>{ status.textContent = 'Could not send — please email ' + C.site.email; })
    .finally(()=>submitBtn.classList.remove('loading'));
});

/* ================= TERMINAL ================= */
window.Terminal = (function(){
  const box = document.getElementById('term'); if(!box) return null;
  const out = box.querySelector('.term-out');
  const input = box.querySelector('#termInput');
  const S = C.site || {};
  let busy = false;
  const esc = s => String(s).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const line = (html, cls) => { const d=document.createElement('div'); d.className='tl '+(cls||''); d.innerHTML=html; out.appendChild(d); out.scrollTop=out.scrollHeight; return d; };
  const sleep = ms => new Promise(r=>setTimeout(r, REDUCE_T ? 0 : ms));
  const REDUCE_T = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  async function type(text, cls, speed){
    const d = line('', cls);
    if(REDUCE_T){ d.innerHTML = text; return; }
    for(let i=0;i<=text.length;i+=2){ d.textContent = text.slice(0,i); out.scrollTop=out.scrollHeight; await sleep(speed||12); }
    d.innerHTML = text;
  }
  const prompt = cmd => line(`<span class="tp">serag@portfolio:~$</span> ${esc(cmd)}`);
  const CMDS = {
    help: ()=>{ line('available commands:','dim'); line('  <b>about</b>  <b>skills</b>  <b>projects</b>  <b>services</b>  <b>pricing</b>  <b>contact</b>  <b>cv</b>  <b>incident</b>  <b>clear</b>'); },
    about: ()=>{ line(`${esc(S.fullName)} — ${esc(S.role)}`); line(`${esc(tx(S.location))} · B.Sc. Communications &amp; Electronics Eng. (exp. 2027)`,'dim'); line('Targeting junior Cloud / DevOps roles. AWS · Networking · Linux.'); },
    skills: ()=>{ (C.skills||[]).forEach(g=>line(`<b>${esc(tx(g.label))}</b>: ${g.items.filter(i=>i.highlight).map(i=>esc(i.name)).join(', ') || g.items.map(i=>esc(i.name)).join(', ')}`)); },
    projects: ()=>{ (window.PROJECTS_LIST||[]).forEach(p=>line(`<a href="#project/${p.id}">→ ${p.title}</a>`)); },
    services: ()=>{ (C.services||[]).forEach(s=>line(`• ${esc(tx(s.title))}`)); },
    pricing: ()=>{ (C.pricing.plans||[]).forEach(p=>line(`${esc(tx(p.name)).padEnd(24,' ')} <b>${money(p)}</b> <span class="dim">${esc(tx(p.unit))}</span>`)); line('custom quote → contact','dim'); },
    contact: ()=>{ line(`email     <a href="mailto:${S.email}">${S.email}</a>`); line(`linkedin  <a href="${S.linkedin}" target="_blank" rel="noopener noreferrer">${S.linkedin}</a>`); if(S.github) line(`github    <a href="${S.github}" target="_blank" rel="noopener noreferrer">${S.github}</a>`); },
    cv: ()=>{ line(`./download-cv.sh → <a href="${S.cv}" download>${S.cv}</a>`); },
    clear: ()=>{ out.innerHTML=''; },
    incident: async ()=>{
      busy = true;
      line('# incident replay — EC2 cannot assume its S3 role (fake IDs)','dim');
      await sleep(300); prompt('aws sts assume-role --role-arn arn:aws:iam::123456789012:role/ec2-s3-read --role-session-name test');
      await sleep(500); line('An error occurred (AccessDenied) when calling the AssumeRole operation: User: arn:aws:sts::123456789012:assumed-role/ec2-app/i-0abc123example is not authorized to perform: sts:AssumeRole','err');
      await sleep(700); await type('# permissions look fine → check who is allowed to ASK: the trust policy','dim');
      prompt('aws iam get-role --role-name ec2-s3-read --query Role.AssumeRolePolicyDocument');
      await sleep(400); line('{ "Principal": { "AWS": "arn:aws:iam::123456789012:user/wrong-user" }, "Action": "sts:AssumeRole" }');
      await sleep(600); await type('# root cause: Principal points at a user, not the EC2 service','dim');
      prompt('aws iam update-assume-role-policy --role-name ec2-s3-read --policy-document file://trust.json');
      await sleep(400); line('<i class="add">+ "Principal": { "Service": "ec2.amazonaws.com" }</i>');
      await sleep(500); prompt('aws sts assume-role --role-arn arn:aws:iam::123456789012:role/ec2-s3-read --role-session-name verify');
      await sleep(500); line('{ "AssumedRoleUser": { "Arn": "arn:aws:sts::123456789012:assumed-role/ec2-s3-read/verify" } }','ok');
      line('✓ resolved — key-free EC2 → S3 access verified','ok');
      busy = false;
    },
    'sudo': ()=>line('nice try. least privilege applies here too. 🔒','warn'),
    'coffee': ()=>line('☕ brewing… uptime of this engineer depends on it.','warn')
  };
  async function run(raw){
    const cmd = raw.trim().toLowerCase(); if(!cmd || busy) return;
    prompt(raw.trim());
    const key = cmd.startsWith('sudo') ? 'sudo' : cmd.split(/\s+/)[0];
    const fn = CMDS[key];
    if(fn) await fn(); else line(`command not found: ${esc(cmd)} — type <b>help</b>`,'err');
  }
  box.addEventListener('submit', e=>{ e.preventDefault(); const v=input.value; input.value=''; run(v); });
  box.querySelectorAll('[data-cmd]').forEach(b=>b.addEventListener('click', ()=>run(b.dataset.cmd)));
  out.addEventListener('click', ()=>{ if(!window.getSelection().toString()) input.focus({preventScroll:true}); });
  let booted = false;
  async function boot(){
    if(booted) return; booted = true; busy = true;
    await type('ssh serag@portfolio','tp',18);
    await type('Connected. Welcome — this is an interactive terminal.','dim');
    await type("type 'help' or tap a command below · try 'incident'",'dim');
    busy = false;
  }
  new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){ boot(); o.disconnect(); } }, {threshold:0.3}).observe(box);
  return { relang(){} };
})();

/* ================= NAV: SCROLL-SPY, MORE MENU, MOBILE MENU ================= */
(function(){
  const links = [...document.querySelectorAll('header nav a[href^="#"]')];
  const map = new Map(); links.forEach(a=>{ const s=document.querySelector(a.getAttribute('href')); if(s){ if(!map.has(s)) map.set(s, []); map.get(s).push(a); } });
  const spy = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ links.forEach(a=>a.classList.remove('active')); (map.get(e.target)||[]).forEach(a=>a.classList.add('active'));
      const more = document.querySelector('.nav-more'); if(more) more.classList.toggle('has-active', !!more.querySelector('a.active')); } });
  }, {rootMargin:'-45% 0px -50% 0px'});
  map.forEach((_,s)=>spy.observe(s));
  const moreBtn = document.getElementById('moreBtn');
  moreBtn?.addEventListener('click', ()=>{ const o = moreBtn.getAttribute('aria-expanded')==='true'; moreBtn.setAttribute('aria-expanded', String(!o)); });
  document.addEventListener('click', e=>{ if(moreBtn && !e.target.closest('.nav-more')) moreBtn.setAttribute('aria-expanded','false'); });
  const menuBtn = document.getElementById('menuBtn'); const hdr = document.getElementById('siteHeader');
  menuBtn?.addEventListener('click', ()=>{ const o = hdr.classList.toggle('menu-open'); menuBtn.setAttribute('aria-expanded', String(o)); });
  links.forEach(a=>a.addEventListener('click', ()=>{ hdr.classList.remove('menu-open'); menuBtn?.setAttribute('aria-expanded','false'); moreBtn?.setAttribute('aria-expanded','false'); }));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ hdr.classList.remove('menu-open'); moreBtn?.setAttribute('aria-expanded','false'); } });
})();

/* ================= FILTERS, SKILLS TOGGLE, COPY EMAIL, REQUEST PREFILL ================= */
document.querySelectorAll('#credFilters .tab').forEach(tab=>{
  const go = ()=>{ document.querySelectorAll('#credFilters .tab').forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-pressed','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-pressed','true'); credFilter = tab.dataset.filter; applyCredFilter(); };
  tab.addEventListener('click', go);
  tab.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
});
document.getElementById('skillsToggle')?.addEventListener('click', e=>{
  const w = document.getElementById('skillGroups'); const on = w.classList.toggle('expanded');
  e.currentTarget.setAttribute('aria-expanded', String(on)); e.currentTarget.textContent = on ? ui('skills.less') : ui('skills.more');
});
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click', async ()=>{
  const v = b.dataset.copy === 'email' ? C.site.email : b.dataset.copy;
  try{ await navigator.clipboard.writeText(v); }catch(_){ const t=document.createElement('textarea'); t.value=v; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  const lbl = b.querySelector('.copy-lbl'); const prev = lbl.textContent; lbl.textContent = ui('contact.copied'); b.classList.add('done');
  setTimeout(()=>{ lbl.textContent = prev; b.classList.remove('done'); }, 1800);
}));
document.addEventListener('click', e=>{
  const r = e.target.closest('[data-request]'); if(!r) return;
  const subj = document.querySelector('#contactForm [name="subject"]'); if(subj) subj.value = 'Request: ' + r.dataset.request;
});
