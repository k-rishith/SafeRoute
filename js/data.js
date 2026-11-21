// Stable Hyderabad demo data. These are illustrative records, not verified live reports.
window.SR = window.SR || {};
const CATEGORIES = ['Pothole','Road Damage','Broken Streetlight','Blocked Footpath','Open Manhole','Waterlogging','Other'];
const SEVERITIES = ['Low','Medium','High','Critical'];
const STATUSES = ['Reported','Under Review','Verified','Assigned','In Progress','Resolved','Disputed','Rejected'];
const now = Date.now();
const ago = (minutes) => new Date(now - minutes * 60000).toISOString();

const hazards = [
  {id:'hyd-001',category:'Pothole',severity:'High',status:'Verified',description:'Deep pothole affecting the left lane near the junction.',lat:17.3857,lng:78.4865,reportedAt:ago(35),lastVerifiedAt:ago(8),verifiedCount:8,disputedCount:1,confidence:87,reporter:'commuter01',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-002',category:'Broken Streetlight',severity:'Medium',status:'Reported',description:'Streetlight not working along the footpath.',lat:17.3922,lng:78.4812,reportedAt:ago(95),lastVerifiedAt:ago(70),verifiedCount:3,disputedCount:0,confidence:78,reporter:'commuter02',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-003',category:'Waterlogging',severity:'Critical',status:'Under Review',description:'Waterlogging reported near the road shoulder after rainfall.',lat:17.3793,lng:78.4934,reportedAt:ago(160),lastVerifiedAt:ago(120),verifiedCount:5,disputedCount:1,confidence:82,reporter:'commuter03',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-004',category:'Road Damage',severity:'High',status:'Assigned',description:'Broken road surface near the bus stop.',lat:17.3971,lng:78.4904,reportedAt:ago(330),lastVerifiedAt:ago(220),verifiedCount:6,disputedCount:0,confidence:91,reporter:'commuter04',imageUrl:'',resolutionImageUrl:null,assignedTo:'Road Maintenance Team'},
  {id:'hyd-005',category:'Pothole',severity:'Critical',status:'In Progress',description:'Large pothole reported at the edge of the carriageway.',lat:17.3736,lng:78.4784,reportedAt:ago(520),lastVerifiedAt:ago(260),verifiedCount:9,disputedCount:0,confidence:94,reporter:'commuter05',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Road Team'},
  {id:'hyd-006',category:'Blocked Footpath',severity:'Medium',status:'Verified',description:'Construction material is blocking pedestrian access.',lat:17.4012,lng:78.4761,reportedAt:ago(740),lastVerifiedAt:ago(300),verifiedCount:4,disputedCount:1,confidence:76,reporter:'commuter06',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-007',category:'Broken Streetlight',severity:'Low',status:'Resolved',description:'Streetlight repaired and checked by the community.',lat:17.3687,lng:78.4899,reportedAt:ago(1900),lastVerifiedAt:ago(900),verifiedCount:7,disputedCount:0,confidence:96,reporter:'commuter07',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Electrical Team'},
  {id:'hyd-008',category:'Open Manhole',severity:'Critical',status:'Reported',description:'Uncovered manhole beside the road.',lat:17.3891,lng:78.5012,reportedAt:ago(55),lastVerifiedAt:ago(50),verifiedCount:2,disputedCount:0,confidence:70,reporter:'commuter08',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-009',category:'Waterlogging',severity:'High',status:'Verified',description:'Water collecting in the service lane.',lat:17.4078,lng:78.4973,reportedAt:ago(430),lastVerifiedAt:ago(90),verifiedCount:6,disputedCount:0,confidence:88,reporter:'commuter09',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-010',category:'Pothole',severity:'Medium',status:'Reported',description:'Small pothole near the crossing; monitor for changes.',lat:17.3812,lng:78.4708,reportedAt:ago(125),lastVerifiedAt:ago(125),verifiedCount:1,disputedCount:0,confidence:62,reporter:'commuter10',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-011',category:'Road Damage',severity:'Low',status:'Resolved',description:'Damaged asphalt patch repaired.',lat:17.4141,lng:78.4832,reportedAt:ago(4800),lastVerifiedAt:ago(1200),verifiedCount:8,disputedCount:0,confidence:97,reporter:'commuter11',imageUrl:'',resolutionImageUrl:null,assignedTo:'Road Maintenance Team'},
  {id:'hyd-012',category:'Broken Streetlight',severity:'Critical',status:'Under Review',description:'Multiple streetlights are out near the intersection.',lat:17.3608,lng:78.4962,reportedAt:ago(200),lastVerifiedAt:ago(165),verifiedCount:5,disputedCount:2,confidence:74,reporter:'commuter12',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-013',category:'Pothole',severity:'High',status:'Reported',description:'Deep pothole near the KPHB main road junction.',area:'KPHB Colony',lat:17.4938,lng:78.3991,reportedAt:ago(42),lastVerifiedAt:ago(42),verifiedCount:2,disputedCount:0,confidence:100,reporter:'commuter13',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-014',category:'Road Damage',severity:'Medium',status:'Under Review',description:'Uneven road surface near Kukatpally Metro station.',area:'Kukatpally',lat:17.4849,lng:78.4138,reportedAt:ago(135),lastVerifiedAt:ago(80),verifiedCount:3,disputedCount:1,confidence:75,reporter:'commuter14',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-015',category:'Broken Streetlight',severity:'Low',status:'Reported',description:'Streetlight outage along the Miyapur service road.',area:'Miyapur',lat:17.4968,lng:78.3592,reportedAt:ago(205),lastVerifiedAt:ago(205),verifiedCount:1,disputedCount:0,confidence:100,reporter:'commuter15',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-016',category:'Waterlogging',severity:'High',status:'Verified',description:'Water collects across one lane during evening traffic.',area:'Kondapur',lat:17.4638,lng:78.3634,reportedAt:ago(310),lastVerifiedAt:ago(95),verifiedCount:5,disputedCount:1,confidence:83,reporter:'commuter16',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-017',category:'Pothole',severity:'Critical',status:'In Progress',description:'Large pothole close to the Hitec City flyover approach.',area:'HITEC City',lat:17.4437,lng:78.3814,reportedAt:ago(70),lastVerifiedAt:ago(18),verifiedCount:7,disputedCount:0,confidence:100,reporter:'commuter17',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Road Team'},
  {id:'hyd-018',category:'Blocked Footpath',severity:'Medium',status:'Reported',description:'Parked vehicles are blocking the pedestrian path.',area:'Gachibowli',lat:17.4402,lng:78.3489,reportedAt:ago(390),lastVerifiedAt:ago(220),verifiedCount:2,disputedCount:1,confidence:67,reporter:'commuter18',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-019',category:'Road Damage',severity:'High',status:'Assigned',description:'Damaged road edge reported near the Financial District entrance.',area:'Financial District',lat:17.4184,lng:78.3418,reportedAt:ago(610),lastVerifiedAt:ago(140),verifiedCount:4,disputedCount:0,confidence:100,reporter:'commuter19',imageUrl:'',resolutionImageUrl:null,assignedTo:'Road Maintenance Team'},
  {id:'hyd-020',category:'Open Manhole',severity:'Critical',status:'Reported',description:'Manhole cover appears displaced beside the main road.',area:'Manikonda',lat:17.4048,lng:78.3762,reportedAt:ago(28),lastVerifiedAt:ago(15),verifiedCount:2,disputedCount:0,confidence:100,reporter:'commuter20',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-021',category:'Broken Streetlight',severity:'Medium',status:'Under Review',description:'Streetlights are not working on the Jubilee Hills stretch.',area:'Jubilee Hills',lat:17.4317,lng:78.4071,reportedAt:ago(840),lastVerifiedAt:ago(340),verifiedCount:4,disputedCount:1,confidence:80,reporter:'commuter21',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-022',category:'Pothole',severity:'High',status:'Verified',description:'Pothole near the Banjara Hills road divider.',area:'Banjara Hills',lat:17.4157,lng:78.4482,reportedAt:ago(180),lastVerifiedAt:ago(32),verifiedCount:6,disputedCount:0,confidence:100,reporter:'commuter22',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-023',category:'Waterlogging',severity:'Medium',status:'Reported',description:'Water pooling near the Ameerpet bus stop.',area:'Ameerpet',lat:17.4375,lng:78.4483,reportedAt:ago(255),lastVerifiedAt:ago(180),verifiedCount:2,disputedCount:1,confidence:67,reporter:'commuter23',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-024',category:'Road Damage',severity:'Low',status:'Resolved',description:'A damaged patch near Begumpet has been repaired.',area:'Begumpet',lat:17.4437,lng:78.4602,reportedAt:ago(3600),lastVerifiedAt:ago(800),verifiedCount:5,disputedCount:0,confidence:100,reporter:'commuter24',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Road Team'},
  {id:'hyd-025',category:'Pothole',severity:'Critical',status:'Reported',description:'Large pothole reported on the Secunderabad approach road.',area:'Secunderabad',lat:17.4399,lng:78.4983,reportedAt:ago(66),lastVerifiedAt:ago(40),verifiedCount:3,disputedCount:0,confidence:100,reporter:'commuter25',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-026',category:'Broken Streetlight',severity:'Medium',status:'Assigned',description:'Several streetlights are out near the Tarnaka junction.',area:'Tarnaka',lat:17.4283,lng:78.5380,reportedAt:ago(920),lastVerifiedAt:ago(280),verifiedCount:4,disputedCount:1,confidence:80,reporter:'commuter26',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Electrical Team'},
  {id:'hyd-027',category:'Blocked Footpath',severity:'Low',status:'Reported',description:'Footpath access is narrowed by roadside material.',area:'Nacharam',lat:17.4313,lng:78.5585,reportedAt:ago(480),lastVerifiedAt:ago(480),verifiedCount:1,disputedCount:0,confidence:100,reporter:'commuter27',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-028',category:'Waterlogging',severity:'High',status:'In Progress',description:'Waterlogged stretch affecting the Uppal service lane.',area:'Uppal',lat:17.4015,lng:78.5591,reportedAt:ago(150),lastVerifiedAt:ago(45),verifiedCount:6,disputedCount:1,confidence:86,reporter:'commuter28',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Drainage Team'},
  {id:'hyd-029',category:'Road Damage',severity:'Medium',status:'Verified',description:'Cracked road surface reported near Dilsukhnagar crossroads.',area:'Dilsukhnagar',lat:17.3688,lng:78.5247,reportedAt:ago(275),lastVerifiedAt:ago(75),verifiedCount:4,disputedCount:0,confidence:100,reporter:'commuter29',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-030',category:'Pothole',severity:'High',status:'Under Review',description:'Pothole affecting two-wheelers near LB Nagar junction.',area:'LB Nagar',lat:17.3457,lng:78.5522,reportedAt:ago(115),lastVerifiedAt:ago(60),verifiedCount:3,disputedCount:1,confidence:75,reporter:'commuter30',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-031',category:'Open Manhole',severity:'Critical',status:'Reported',description:'Open manhole reported along the Mehdipatnam main road.',area:'Mehdipatnam',lat:17.3937,lng:78.4396,reportedAt:ago(24),lastVerifiedAt:ago(24),verifiedCount:2,disputedCount:0,confidence:100,reporter:'commuter31',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-032',category:'Broken Streetlight',severity:'Low',status:'Resolved',description:'Streetlight repaired near the Tolichowki junction.',area:'Tolichowki',lat:17.4001,lng:78.4146,reportedAt:ago(2800),lastVerifiedAt:ago(520),verifiedCount:5,disputedCount:0,confidence:100,reporter:'commuter32',imageUrl:'',resolutionImageUrl:null,assignedTo:'GHMC Electrical Team'},
  {id:'hyd-033',category:'Road Damage',severity:'Medium',status:'Reported',description:'Uneven road surface near Attapur road junction.',area:'Attapur',lat:17.3678,lng:78.4250,reportedAt:ago(190),lastVerifiedAt:ago(130),verifiedCount:2,disputedCount:1,confidence:67,reporter:'commuter33',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-034',category:'Waterlogging',severity:'High',status:'Under Review',description:'Water accumulation reported near the Charminar approach.',area:'Charminar',lat:17.3616,lng:78.4747,reportedAt:ago(340),lastVerifiedAt:ago(150),verifiedCount:4,disputedCount:1,confidence:80,reporter:'commuter34',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-035',category:'Pothole',severity:'Medium',status:'Verified',description:'Pothole reported near the Nampally railway station road.',area:'Nampally',lat:17.3840,lng:78.4747,reportedAt:ago(225),lastVerifiedAt:ago(58),verifiedCount:5,disputedCount:0,confidence:100,reporter:'commuter35',imageUrl:'',resolutionImageUrl:null,assignedTo:null},
  {id:'hyd-036',category:'Blocked Footpath',severity:'Low',status:'Reported',description:'Pedestrian walkway is partially blocked near Abids.',area:'Abids',lat:17.3890,lng:78.4747,reportedAt:ago(560),lastVerifiedAt:ago(330),verifiedCount:2,disputedCount:1,confidence:67,reporter:'commuter36',imageUrl:'',resolutionImageUrl:null,assignedTo:null}
];

window.SR.mock = {
  hazards,
  users: [
    {id:'u1',name:'Aarav Sharma',role:'resident',email:'aarav@example.com'},
    {id:'u2',name:'Priya Verma',role:'verifier',email:'priya@example.com'},
    {id:'u3',name:'Road Maintenance Team',role:'maintenance',email:'maint@example.com'},
    {id:'u4',name:'Admin',role:'admin',email:'admin@example.com'}
  ],
  analytics: {
    totalReports: hazards.length,
    verified: hazards.filter(h=>h.status==='Verified').length,
    resolved: hazards.filter(h=>h.status==='Resolved').length,
    pending: hazards.filter(h=>['Reported','Under Review','Assigned','In Progress'].includes(h.status)).length
  },
  hotspots: Object.values(hazards.reduce((groups,h)=>{
    const name=h.area||'Hyderabad';
    groups[name]=groups[name]||{name,reports:0};
    groups[name].reports+=1;
    return groups;
  },{})).sort((a,b)=>b.reports-a.reports),
  routes: [
    {id:'A',name:'Route A — Outer Ring Bypass',distance:8.4,time:32,hazards:1,highSeverity:0,score:12,tag:'LOWER REPORTED HAZARD EXPOSURE'},
    {id:'B',name:'Route B — Central Avenue Corridor',distance:7.2,time:28,hazards:6,highSeverity:2,score:68,tag:'MORE REPORTED HAZARDS'}
  ],
  categories:CATEGORIES,
  severities:SEVERITIES,
  statuses:STATUSES
};
