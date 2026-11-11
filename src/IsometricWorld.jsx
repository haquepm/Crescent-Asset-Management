import React,{useMemo}from'react';import{Building2,Warehouse,Truck,Boxes,MapPin,Package}from'lucide-react';
const n=v=>Number(v||0),label=(s,k=19)=>String(s||'Site').length>k?String(s).slice(0,k-1)+'…':String(s||'Site');
export default function IsometricWorld({locations=[],projects=[],balances=[],items=[],challans=[],onSelectLocation,selectedId}) {
 const active=useMemo(()=>locations.filter(x=>x.is_active!==false),[locations]);
 const coords=active.filter(x=>Number.isFinite(n(x.latitude))&&Number.isFinite(n(x.longitude))&&x.latitude!==null&&x.longitude!==null);
 const minLat=Math.min(...coords.map(x=>n(x.latitude))),maxLat=Math.max(...coords.map(x=>n(x.latitude))),minLon=Math.min(...coords.map(x=>n(x.longitude))),maxLon=Math.max(...coords.map(x=>n(x.longitude)));
 const position=(loc,i)=>{if(coords.length&&loc.latitude!=null&&loc.longitude!=null){const dx=maxLon-minLon||.01,dy=maxLat-minLat||.01;return{x:170+(n(loc.longitude)-minLon)/dx*560,y:125+(maxLat-n(loc.latitude))/dy*250}}const count=Math.max(active.length,1),cols=Math.min(3,count),row=Math.floor(i/cols),col=i%cols;return{x:180+col*270+(row%2)*60,y:125+row*175}};
 const nodes=active.map((loc,i)=>{const p=position(loc,i),stock=balances.filter(b=>b.location_id===loc.id),qty=stock.reduce((s,b)=>s+n(b.quantity_on_hand),0),skus=stock.filter(b=>n(b.quantity_on_hand)>0).length;return{loc,...p,qty,skus,index:i}});
 const dispatches=challans.filter(c=>c.source_location_id&&c.destination_location_id&&!['RECEIVED','CANCELLED','CLOSED','CANCELLED','VOID'].includes(String(c.status||'').toUpperCase()));
 const path=(a,b)=>'M '+a.x+' '+(a.y+15)+' Q '+((a.x+b.x)/2)+' '+(Math.min(a.y,b.y)-35)+' '+b.x+' '+(b.y+15);
 const find=id=>nodes.find(x=>x.loc.id===id);
 return <div className="iso-world-map">
  <div className="iso-world-map-head"><span><i/> LIVE ISOMETRIC OPERATIONS WORLD</span><small>Illustrative site layouts · live Crescent records</small><div><b className="site"/> Project site <b className="yard"/> Yard <b className="route"/> Movement</div></div>
  <div className="iso-world-canvas">
   <svg viewBox="0 0 900 500" role="img" aria-label="Isometric strategic view of project sites, yards, materials and recorded vehicle movements">
    <defs><pattern id="isoGrid" width="42" height="24" patternUnits="userSpaceOnUse"><path d="M21 0L42 12 21 24 0 12Z" fill="none" stroke="#bcb0dc" strokeOpacity=".28" strokeWidth="1"/></pattern><linearGradient id="siteTop" x2="1" y2="1"><stop stopColor="#eee9ff"/><stop offset="1" stopColor="#cfc4ed"/></linearGradient><linearGradient id="yardTop" x2="1" y2="1"><stop stopColor="#d9f4ed"/><stop offset="1" stopColor="#a9d8ca"/></linearGradient></defs>
    <rect width="900" height="500" fill="url(#isoGrid)"/>
    <path d="M0 360L250 220 540 390 900 180" stroke="#fff" strokeWidth="29" fill="none" opacity=".85"/><path d="M0 360L250 220 540 390 900 180" stroke="#c8c0d9" strokeWidth="19" fill="none"/><path d="M0 360L250 220 540 390 900 180" stroke="#fff" strokeWidth="2" strokeDasharray="10 12" fill="none"/>
    {nodes.map((p,i)=><g key={'plot'+p.loc.id} opacity=".7"><path d={'M '+(p.x-105)+' '+(p.y+45)+' l 105 -60 105 60 -105 60Z'} fill="#e9e3f6" stroke="#c9bfdf"/><path d={'M '+(p.x-105)+' '+(p.y+45)+' l 0 12 105 60 0 -12Z'} fill="#c8bfdf"/><path d={'M '+(p.x+105)+' '+(p.y+45)+' l 0 12 -105 60 0 -12Z'} fill="#b9afd4"/></g>)}
    {dispatches.map((c,i)=>{const a=find(c.source_location_id),b=find(c.destination_location_id);if(!a||!b)return null;const d=path(a,b),moving=!['RECEIVED','CANCELLED','CLOSED'].includes(String(c.status||'').toUpperCase());return <g key={c.id}><path d={d} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round"/><path d={d} fill="none" stroke="#e5a23e" strokeWidth="4" strokeDasharray="9 8" strokeLinecap="round"/>{moving&&<g><circle r="12" fill="#fff" stroke="#7252cf" strokeWidth="3"><animateMotion dur={(8+i*2)+'s'} repeatCount="indefinite" path={d}/></circle><g><animateMotion dur={(8+i*2)+'s'} repeatCount="indefinite" path={d}/><rect x="-12" y="-7" width="24" height="14" rx="4" fill="#6e50cb" stroke="#fff" strokeWidth="2"/><rect x="4" y="-5" width="7" height="7" rx="1" fill="#d9ceff"/></g></g>}</g>})}
    {nodes.map((p,i)=>{const yard=String(p.loc.location_type).toUpperCase()==='YARD',sel=selectedId===p.loc.id;return <g key={p.loc.id} transform={'translate('+p.x+' '+p.y+')'} className="iso-world-node" onClick={()=>onSelectLocation?.(p.loc)} style={{cursor:'pointer'}}>
      <ellipse cx="0" cy="47" rx="93" ry="22" fill="#544477" opacity=".13"/>
      <path d="M-86 10L0-39 86 10 0 59Z" fill={yard?'#8dcaba':'#b5a7dc'} stroke={sel?'#6542c4':'#fff'} strokeWidth={sel?4:2}/>
      <path d="M-86 10L0 59V74L-86 25Z" fill={yard?'#5eaa98':'#9180bb'}/><path d="M86 10L0 59V74L86 25Z" fill={yard?'#4d9787':'#7867a4'}/>
      {yard?<g><path d="M-49 7L-3-19 45 8 0 35Z" fill="#e8f7f2" stroke="#4c9c89" strokeWidth="2"/><path d="M-49 7V-12L-3-38V-19Z" fill="#a8d9cb"/><path d="M-3-19V-38L45-11V8Z" fill="#75bba8"/><path d="M-33 0L-33-8 -15-18 -15-10Z M-7-15L-7-23 11-13 11-5Z" fill="#4d8e80"/></g>:<g><path d="M-43 0V-44L0-69 43-44V0L0 25Z" fill="#8c7ab8" stroke="#6e5a9f" strokeWidth="2"/><path d="M-43-44L0-69 43-44 0-19Z" fill="#f0eaff"/><path d="M0-19V25L43 0V-44Z" fill="#74629e"/><path d="M-31-38L0-56 30-39 0-21Z" fill="#c8bce8"/><rect x="-12" y="-9" width="14" height="18" fill="#e8e0ff" opacity=".9"/></g>}
      <g>{[0,1,2].map(j=><g key={j} transform={'translate('+(j*15-20)+' '+(j%2*5+19)+')'}><rect x="-7" y="-13" width="14" height="12" rx="2" fill={j%2?'#e8b965':'#d4a65c'} stroke="#9f7741"/><path d="M-7-13L0-17 7-13 0-9Z" fill="#f4d391"/></g>)}</g>
      <circle cx="0" cy="-79" r="13" fill={yard?'#159c83':'#7654d6'} stroke="#fff" strokeWidth="3"/><circle cx="0" cy="-79" r="4" fill="#fff"/>
      <rect x="-76" y="82" width="152" height="38" rx="8" fill={sel?'#5f42bd':'#fff'} stroke={sel?'#5f42bd':'#e1d9ef'} strokeWidth="1.5"/><text x="0" y="98" textAnchor="middle" fontSize="11" fontWeight="800" fill={sel?'#fff':'#382c57'}>{label(p.loc.location_name,21)}</text><text x="0" y="111" textAnchor="middle" fontSize="8" fill={sel?'#eee8ff':'#827895'}>{p.qty.toLocaleString('en-IN')} material units · {p.skus} types</text>
    </g>})}
    {!nodes.length&&<text x="450" y="245" textAnchor="middle" fill="#786d91" fontSize="15">Add project sites and yards to populate your operations world</text>}
   </svg>
   <div className="iso-world-overlay"><span><Building2 size={13}/> {nodes.filter(x=>x.loc.location_type==='PROJECT_SITE').length} project sites</span><span><Warehouse size={13}/> {nodes.filter(x=>x.loc.location_type==='YARD').length} yards</span><span><Boxes size={13}/> {balances.length} stock records</span><span><Truck size={13}/> {dispatches.length} recorded journeys</span></div>
   <small className="iso-world-disclaimer">Strategic isometric illustration · positions use saved coordinates where available; not a navigation map</small>
  </div>
 </div>
}