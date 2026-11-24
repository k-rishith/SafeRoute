// Shared Leaflet map for the home live feed and the full hazard-map page.
window.SR = window.SR || {};
SR.MapView = (function(){
  let map=null, markerLayer=null, hazards=[], selectedFilter='all', refreshTimer=null, realtimeChannel=null;
  const center=window.SAFEROUTE_CONFIG?.mapCenter || [17.3850,78.4867];
  const byId=(id)=>document.getElementById(id);
  const esc=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function markerColor(h){
    if(h.status==='Resolved') return '#22C55E';
    if(h.severity==='Critical') return '#EF4444';
    if(h.severity==='High') return '#F97316';
    if(h.severity==='Medium') return '#D6B84C';
    return '#22C55E';
  }
  function filterHazards(){
    return hazards.filter(h=>{
      if(selectedFilter==='critical') return h.severity==='Critical';
      if(selectedFilter==='potholes') return h.category==='Pothole';
      if(selectedFilter==='streetlights') return h.category==='Broken Streetlight';
      if(selectedFilter==='waterlogging') return h.category==='Waterlogging';
      return true;
    });
  }
  function draw(){
    if(!map||!markerLayer) return;
    markerLayer.clearLayers();
    const visible=filterHazards();
    visible.forEach(h=>{
      if(!Number.isFinite(Number(h.lat))||!Number.isFinite(Number(h.lng))) return;
      const color=markerColor(h);
      const marker=L.circleMarker([Number(h.lat),Number(h.lng)],{radius:8,color:'#24231F',weight:2,fillColor:color,fillOpacity:.95});
      const isPages=location.pathname.includes('/pages/');
      const detailUrl=(isPages?'':'pages/')+'hazard.html?id='+encodeURIComponent(h.id);
      marker.bindPopup(`<div class="map-popup"><strong>${esc(h.category)} · ${esc(h.severity)}</strong><p>${esc(h.description||'Community road hazard report')}</p><small>${esc(h.status||'Reported')} · ${esc(SR.timeAgo(h.reportedAt||h.reported_at||new Date().toISOString()))}</small><br><a href="${detailUrl}">View report details →</a></div>`);
      marker.addTo(markerLayer);
    });
    const count=byId('mapResultCount');
    if(count) count.textContent=`${visible.length} report${visible.length===1?'':'s'} shown`;
    const empty=byId('mapEmpty');
    if(empty) empty.hidden=visible.length>0;
  }
  function setFilter(filter,button){
    selectedFilter=filter;
    document.querySelectorAll('[data-hazard-filter]').forEach(b=>b.classList.toggle('active',b===button));
    draw();
  }
  async function refresh({quiet=false}={}){
    const btn=byId('mapRefresh');
    if(btn){btn.disabled=true;btn.classList.add('is-loading');}
    try{
      hazards=await SR.api.listHazards();
      draw();
      const stamp=byId('mapLastUpdated');
      if(stamp) stamp.textContent='Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      if(!quiet) SR.toast('Road condition reports refreshed','success');
    }catch(error){
      console.error(error);
      if(!quiet) SR.toast('Could not refresh road reports','error');
    }finally{
      if(btn){btn.disabled=false;btn.classList.remove('is-loading');}
    }
  }
  function init(mapId='homeMap'){
    const node=byId(mapId);
    if(!node) return;
    if(!window.L){node.innerHTML='<p class="map-error">Map library could not load. Check your connection and reload.</p>';return;}
    if(map) map.remove();
    map=L.map(node,{scrollWheelZoom:false}).setView(center,window.SAFEROUTE_CONFIG?.mapZoom||12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    markerLayer=L.layerGroup().addTo(map);
    document.querySelectorAll('[data-hazard-filter]').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.hazardFilter,button)));
    byId('mapRefresh')?.addEventListener('click',()=>refresh());
    refresh({quiet:true});
    if(refreshTimer) clearInterval(refreshTimer);
    refreshTimer=setInterval(()=>refresh({quiet:true}),window.SAFEROUTE_CONFIG?.mapRefreshMs||60000);
    if(realtimeChannel) SR.supabase?.removeChannel(realtimeChannel);
    realtimeChannel=SR.api.subscribeHazards?.(()=>refresh({quiet:true}));
    const invalidate=()=>map&&map.invalidateSize();
    if(window.ResizeObserver){const ro=new ResizeObserver(invalidate);ro.observe(node);}
    window.addEventListener('resize',invalidate);
    setTimeout(invalidate,200);
  }
  
  return {init,refresh,setFilter,getMap:()=>map};
})();
