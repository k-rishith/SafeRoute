// SafeRoute app helpers
window.SR = window.SR || {};
const SR = window.SR;

SR.toast = function(msg, type='info'){
  let c = document.querySelector('.toast-container');
  if(!c){ c=document.createElement('div'); c.className='toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast toast-'+type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 3000);
};

SR.modal = function(html){
  const o = document.createElement('div');
  o.className='modal-overlay';
  o.innerHTML = `<div class="modal">${html}</div>`;
  document.body.appendChild(o);
  o.addEventListener('click', e=>{ if(e.target===o) o.remove(); });
  o.querySelector('.modal-close')?.addEventListener('click', ()=>o.remove());
  return o;
};

SR.badgeSeverity = function(s){
  const m = {Low:'low',Medium:'medium',High:'high',Critical:'critical'};
  return `<span class="badge badge-${m[s]||'medium'}">● ${s}</span>`;
};
SR.badgeStatus = function(s){
  const map = {Verified:'verified',Resolved:'resolved',Pending:'pending',Disputed:'disputed',Reported:'pending','Under Review':'pending',Assigned:'pending','In Progress':'pending',Rejected:'disputed'};
  return `<span class="badge badge-${map[s]||'pending'}">${s}</span>`;
};
SR.timeAgo = function(iso){
  if(!iso) return 'time unavailable';
  const diff = (Date.now()-new Date(iso).getTime())/1000;
  if(!Number.isFinite(diff)) return 'time unavailable';
  if(diff<60) return 'just now';
  if(diff<3600) return Math.floor(diff/60)+' min ago';
  if(diff<86400) return Math.floor(diff/3600)+' hr ago';
  return Math.floor(diff/86400)+' days ago';
};
SR.formatDate = function(iso){ return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); };

SR.navHTML = function(active){
  const isPages = location.pathname.includes('/pages/');
  const prefix = isPages ? '' : 'pages/';
  const home = isPages ? '../index.html' : 'index.html';
  const links = [
    ['Home',home],['Map',`${prefix}map.html`],
    ['Routes',`${prefix}routes.html`],['Community',`${prefix}community.html`],
    ['Dashboard',`${prefix}dashboard.html`],['About',`${prefix}about.html`]
  ];
  const login = `${prefix}login.html`;
  return `
  <nav class="navbar"><div class="container">
    <a href="${home}" class="nav-logo">Safe<span>Route</span></a>
    <div class="nav-links" id="navLinks">
      ${links.map(([n,u])=>`<a href="${u}" class="${active===n?'active':''}">${n}</a>`).join('')}
    </div>
    <a href="${login}" class="nav-cta">Login / Sign Up</a>
    <button class="nav-toggle" onclick="document.getElementById('mobileMenu').classList.toggle('open')">☰</button>
  </div></nav>
  <div class="mobile-menu" id="mobileMenu">
    ${links.map(([n,u])=>`<a href="${u}" class="${active===n?'active':''}">${n}</a>`).join('')}
    <a href="${login}">Login / Sign Up</a>
  </div>`;
};

SR.footerHTML = function(){
  return `<footer class="footer"><div class="container">
    <div><strong>SafeRoute</strong><br><span class="muted">Community-powered road intelligence.</span></div>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <a href="#">Privacy</a><a href="#">Terms</a>
    </div>
  </footer>`;
};

SR.injectLayout = function(active){
  const nav = document.getElementById('nav-placeholder');
  if(nav) nav.outerHTML = SR.navHTML(active);
  const foot = document.getElementById('footer-placeholder');
  if(foot) foot.outerHTML = SR.footerHTML();
};

// Hazard helpers. Include locally submitted demo reports so detail pages can open them.
SR.hazards = () => {
  let saved=[];
  try { saved=JSON.parse(localStorage.getItem('sr-demo-hazards')||'[]'); } catch(e) {}
  const all=[...saved, ...(window.SR.mock?window.SR.mock.hazards:[])];
  return all.map(h=>{
    let reportPhoto='',beforePhoto='',afterPhoto='';
    try { reportPhoto=localStorage.getItem(`sr-evidence-${h.id}-evidence`)||''; beforePhoto=localStorage.getItem(`sr-evidence-${h.id}-before`)||''; afterPhoto=localStorage.getItem(`sr-evidence-${h.id}-after`)||''; } catch(e) {}
    return {...h,imageUrl:h.imageUrl||reportPhoto||beforePhoto,resolutionImageUrl:h.resolutionImageUrl||afterPhoto||null};
  });
};
SR.getHazard = (id) => SR.hazards().find(h=>String(h.id)===String(id));
