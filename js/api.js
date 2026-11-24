// SafeRoute data layer: Supabase when configured, browser demo data otherwise.
window.SR = window.SR || {};
const SRApi = window.SR;

function parsePoint(value){
  if(!value) return null;
  if(typeof value === 'object' && Array.isArray(value.coordinates)) return {lat:Number(value.coordinates[1]),lng:Number(value.coordinates[0])};
  if(typeof value === 'string'){
    const match=value.match(/POINT\s*\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
    if(match) return {lng:Number(match[1]),lat:Number(match[2])};
    try { return parsePoint(JSON.parse(value)); } catch(e) { return null; }
  }
  return null;
}

function getMockHazards(){
  let saved=[];
  try { saved=JSON.parse(localStorage.getItem('sr-demo-hazards')||'[]'); } catch(e) { saved=[]; }
  return [...saved, ...(SRApi.mock?.hazards||[])];
}


async function imageToDataUrl(file){
  if(window.createImageBitmap){
    try{
      const bitmap=await createImageBitmap(file);
      const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bitmap.width*scale));
      canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      const ctx=canvas.getContext('2d');
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      bitmap.close?.();
      return canvas.toDataURL('image/jpeg',0.78);
    }catch(error){ console.warn('Image compression fallback:',error); }
  }
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
}

function normalizeHazard(row){
  const location=Array.isArray(row.locations)?row.locations[0]:row.locations;
  let localEvidence='';
  try { localEvidence=localStorage.getItem(`sr-evidence-${row.id}-evidence`)||''; } catch(e) {}
  const hasCoordinates=row.lat!==null&&row.lat!==undefined&&row.lng!==null&&row.lng!==undefined;
  const point=parsePoint(location?.geom) || (hasCoordinates&&Number.isFinite(Number(row.lat))&&Number.isFinite(Number(row.lng))?{lat:Number(row.lat),lng:Number(row.lng)}:null);
  return {
    ...row,
    lat:point?.lat,
    lng:point?.lng,
    reportedAt:row.reportedAt || row.reported_at || row.created_at,
    lastVerifiedAt:row.lastVerifiedAt || row.last_verified_at,
    verifiedCount:row.verifiedCount ?? row.verified_count ?? 0,
    disputedCount:row.disputedCount ?? row.disputed_count ?? 0,
    confidence:row.confidence ?? 0,
    imageUrl:row.imageUrl || row.image_url || row.report_images?.find?.(i=>i.kind==='evidence')?.url || localEvidence || '',
    resolutionImageUrl:row.resolutionImageUrl || row.report_images?.find?.(i=>i.kind==='after')?.url || null,
    assignedTo:row.assignedTo || row.assigned_to || null
  };
}

SRApi.api = {
  async listHazards(filters={}){
    if(SRApi.useMock || !SRApi.supabase) return getMockHazards().map(normalizeHazard).filter(h=>matches(h,filters));
    let q=SRApi.supabase.from('hazard_reports').select('*, locations(id,geom,address), report_images(url,kind)').order('reported_at',{ascending:false});
    if(filters.category) q=q.eq('category',filters.category);
    if(filters.severity) q=q.eq('severity',filters.severity);
    if(filters.status) q=q.eq('status',filters.status);
    const {data,error}=await q;
    if(error){console.error('Could not load hazard reports:',error);SRApi.toast('Could not refresh hazard reports','error');return [];}
    return (data||[]).map(normalizeHazard).filter(h=>matches(h,filters));
  },
  async getHazard(id){
    if(SRApi.useMock || !SRApi.supabase) return normalizeHazard(getMockHazards().find(h=>String(h.id)===String(id)));
    const {data,error}=await SRApi.supabase.from('hazard_reports').select('*, locations(id,geom,address), report_images(url,kind)').eq('id',id).single();
    if(error){console.error(error);return null;}
    return normalizeHazard(data);
  },
  async createHazard(payload){
    if(SRApi.useMock || !SRApi.supabase){
      const h={id:'local-'+Date.now(),...payload,reportedAt:new Date().toISOString(),status:'Reported',verifiedCount:0,disputedCount:0,confidence:0};
      try { const saved=JSON.parse(localStorage.getItem('sr-demo-hazards')||'[]'); saved.unshift(h); localStorage.setItem('sr-demo-hazards',JSON.stringify(saved)); } catch(e) { console.warn('Could not persist demo report:',e); SRApi.mock.hazards.unshift(h); }
      SRApi.toast('Demo report saved in this browser','success');
      return h;
    }
    const userResult=await SRApi.supabase.auth.getUser();
    const user=userResult.data?.user;
    if(!user){SRApi.toast('Sign in before submitting a report','error');return null;}
    let location_id=null;
    if(Number.isFinite(payload.lat)&&Number.isFinite(payload.lng)){
      const point=`SRID=4326;POINT(${payload.lng} ${payload.lat})`;
      const {data:loc,error:locError}=await SRApi.supabase.from('locations').insert({geom:point,address:payload.address||null,created_by:user.id}).select('id').single();
      if(locError){console.error(locError);SRApi.toast('Could not save report location','error');return null;}
      location_id=loc.id;
    }
    const row={category:payload.category,severity:payload.severity,description:payload.description,status:'Reported',location_id,reporter_id:user.id};
    const {data,error}=await SRApi.supabase.from('hazard_reports').insert(row).select().single();
    if(error){console.error(error);SRApi.toast('Report submission failed','error');return null;}
    SRApi.toast('Report submitted','success');
    return normalizeHazard({...data,lat:payload.lat,lng:payload.lng});
  },
  async verifyHazard(id,verdict){
    if(SRApi.useMock || !SRApi.supabase){SRApi.toast('Demo response recorded','success');return true;}
    const {data:{user}}=await SRApi.supabase.auth.getUser();
    if(!user){SRApi.toast('Sign in to submit a community response','error');return false;}
    const {error}=await SRApi.supabase.from('verifications').upsert({hazard_id:id,user_id:user.id,verdict},{onConflict:'hazard_id,user_id'});
    if(error){console.error(error);SRApi.toast(error.code==='23505'?'You have already responded to this report':'Could not save your response','error');return false;}
    SRApi.toast('Community response submitted','success');
    return true;
  },
  async uploadEvidence(hazardId,file,kind='before'){
    if(!file) return null;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){SRApi.toast('Choose a JPG, PNG or WebP image','error');return null;}
    if(file.size>8*1024*1024){SRApi.toast('Image must be smaller than 8 MB','error');return null;}
    if(SRApi.useMock || !SRApi.supabase){
      const dataUrl=await imageToDataUrl(file);
      try{localStorage.setItem(`sr-evidence-${hazardId}-${kind}`,dataUrl);}catch(e){SRApi.toast('Image preview loaded, but browser storage is full','error');return {url:dataUrl,localOnly:true};}
      try { const saved=JSON.parse(localStorage.getItem('sr-demo-hazards')||'[]'); const row=saved.find(h=>String(h.id)===String(hazardId)); if(row){ if(kind==='after') row.resolutionImageUrl=dataUrl; else if(kind==='before') row.beforeImageUrl=dataUrl; else row.imageUrl=dataUrl; localStorage.setItem('sr-demo-hazards',JSON.stringify(saved)); } } catch(e) {}
      SRApi.toast(kind==='before'?'Before photo saved in this browser demo':kind==='after'?'After photo saved in this browser demo':'Report photo saved in this browser demo','success');
      return {url:dataUrl,localOnly:true};
    }
    const {data:{user}}=await SRApi.supabase.auth.getUser();
    if(!user){SRApi.toast('Sign in to upload maintenance evidence','error');return null;}
    const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path=`${hazardId}/${kind}-${Date.now()}-${safeName}`;
    const {error:uploadError}=await SRApi.supabase.storage.from('hazard-evidence').upload(path,file,{upsert:false,contentType:file.type});
    if(uploadError){console.error(uploadError);SRApi.toast('Evidence upload failed. Check the hazard-evidence bucket and its policies.','error');return null;}
    const {data:publicData}=SRApi.supabase.storage.from('hazard-evidence').getPublicUrl(path);
    const {error:rowError}=await SRApi.supabase.from('report_images').insert({hazard_id:hazardId,url:publicData.publicUrl,kind,uploaded_by:user.id});
    if(rowError){console.error(rowError);SRApi.toast('Photo uploaded but evidence record could not be saved','error');return null;}
    SRApi.toast(kind==='before'?'Before evidence uploaded':kind==='after'?'After evidence uploaded':'Report image uploaded','success');
    return {url:publicData.publicUrl};
  },
  async listHotspots(){
    if(SRApi.useMock || !SRApi.supabase) return SRApi.mock.hotspots;
    const {data,error}=await SRApi.supabase.from('hazard_hotspots').select('*');
    if(error){console.error(error);return [];}
    return data||[];
  },
  async analytics(){
    if(SRApi.useMock || !SRApi.supabase) return SRApi.mock.analytics;
    const hazards=await this.listHazards();
    return {totalReports:hazards.length,verified:hazards.filter(h=>h.status==='Verified').length,resolved:hazards.filter(h=>h.status==='Resolved').length,pending:hazards.filter(h=>['Reported','Under Review'].includes(h.status)).length};
  },
  subscribeHazards(callback){
    if(SRApi.useMock || !SRApi.supabase) return null;
    // Verification triggers update hazard_reports counts, so this single
    // public feed keeps counters live without exposing individual vote rows.
    const channel=SRApi.supabase.channel('saferoute-hazard-feed')
      .on('postgres_changes',{event:'*',schema:'public',table:'hazard_reports'},callback)
      .subscribe();
    return channel;
  }
  
};

function matches(h,filters){
  return (!filters.category||h.category===filters.category) &&
    (!filters.severity||h.severity===filters.severity) &&
    (!filters.status||h.status===filters.status);
}
