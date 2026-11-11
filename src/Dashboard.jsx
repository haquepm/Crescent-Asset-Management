import React,{useEffect,useState}from'react';
import{Boxes,MapPin,Package,Plus,ArrowUpRight,Wrench,Truck,Warehouse,FileBarChart,CheckCircle2,ChevronRight,Box}from'lucide-react';
import{supabase}from'./supabase';
import IsometricScene from './IsometricScene';
const heroBanner='/Golden-Hour%20Construction%20Site%20Panorama.png';
const pics=['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1590725140246-20acdf2c5e6e?auto=format&fit=crop&w=500&q=85','https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&q=85'];
import {Fuel,ClipboardList,Bell,Activity,AlertTriangle,RefreshCw,Building2,ArrowLeftRight} from 'lucide-react';
export default function Dashboard({title,onNavigate}){
 const[d,S]=useState({items:[],locations:[],projects:[],balances:[],maintenance:[],movements:[],categories:[],vehicles:[],challans:[],requests:[],equipment:[],drums:[],issues:[],readings:[]}),[busy,B]=useState(false),[selectedAsset,SA]=useState(null);
 const load=async()=>{B(true);const [i,l,p,b,m,mv,c,v,ch,r,e,dr,di,rd]=await Promise.all([
  supabase.from('items').select('*,item_categories(category_name)').order('created_at',{ascending:false}).limit(500),
  supabase.from('locations').select('*').order('location_name').limit(100),
  supabase.from('projects').select('*').order('project_name').limit(100),
  supabase.from('stock_balances').select('*').limit(1000),
  supabase.from('maintenance_records').select('*').order('reported_date',{ascending:false}).limit(8),
  supabase.from('stock_movements').select('*').order('movement_date',{ascending:false}).limit(100),
  supabase.from('item_categories').select('*').limit(100),
  supabase.from('vehicles').select('*').order('registration_number').limit(200),
  supabase.from('delivery_challans').select('*').order('dispatch_date',{ascending:false}).limit(100),
  supabase.from('asset_requests').select('id,request_number,status,request_type,created_at,destination_location_id').order('created_at',{ascending:false}).limit(100),
  supabase.from('plant_equipment').select('id,equipment_code,equipment_name,ownership_type,status,current_location_id').limit(300),
  supabase.from('diesel_drums').select('id,drum_code,location_id,capacity_litres').limit(200),
  supabase.from('diesel_issues').select('id,status,quantity_litres,created_at,drum_id,equipment_id').order('created_at',{ascending:false}).limit(100),
  supabase.from('plant_meter_readings').select('id,reading_date,equipment_id').order('reading_date',{ascending:false}).limit(100)
 ]);
 S({items:i.data||[],locations:l.data||[],projects:p.data||[],balances:b.data||[],maintenance:m.data||[],movements:mv.data||[],categories:c.data||[],vehicles:v.data||[],challans:ch.data||[],requests:r.data||[],equipment:e.data||[],drums:dr.data||[],issues:di.data||[],readings:rd.data||[]});B(false)};
 useEffect(()=>{load();const f=()=>load();window.addEventListener('asset-data-changed',f);return()=>window.removeEventListener('asset-data-changed',f)},[]);
 const total=d.balances.reduce((s,x)=>s+Number(x.quantity_on_hand||0),0),reserved=d.balances.reduce((s,x)=>s+Number(x.quantity_reserved||0),0),transit=d.balances.reduce((s,x)=>s+Number(x.quantity_in_transit||0),0),maint=d.balances.reduce((s,x)=>s+Number(x.quantity_under_maintenance||0),0),inuse=Math.max(0,total-reserved-transit-maint),yard=Math.max(0,total-inuse-maint);
 const activeLocations=d.locations.filter(x=>x.is_active!==false),activeFleet=d.vehicles.filter(x=>x.is_active!==false),openRequests=d.requests.filter(x=>!['FULFILLED','CANCELLED','REJECTED','CLOSED','COMPLETED','VOID'].includes(String(x.status||'').toUpperCase()));
 const pendingIssues=d.issues.filter(x=>String(x.status||'').toUpperCase()==='PENDING'),approvedIssues=d.issues.filter(x=>String(x.status||'').toUpperCase()==='APPROVED');
 const activeDispatches=d.challans.filter(x=>!['RECEIVED','CANCELLED','CLOSED','COMPLETED'].includes(String(x.status||'').toUpperCase()));
 const alerts=[...openRequests.slice(0,4).map(x=>({id:x.id,kind:'request',title:x.request_type||'Site request',detail:x.request_number||'Awaiting review',status:x.status||'PENDING',location:d.locations.find(l=>l.id===x.destination_location_id)?.location_name||'Project site'})),...pendingIssues.slice(0,3).map(x=>({id:x.id,kind:'fuel',title:'Fuel issue approval',detail:Number(x.quantity_litres||0).toLocaleString('en-IN')+' litres',status:'PENDING',location:'Plant & Fuel'})),...d.maintenance.slice(0,3).map(x=>({id:x.id,kind:'maintenance',title:x.title||x.description||'Maintenance activity',detail:x.status||'Maintenance record',status:x.status||'REPORTED',location:'Maintenance'}))].slice(0,9);
 const latest=d.movements.slice(0,5);
 const recentAssets=d.items.slice(0,5);
 const number=v=>Number(v||0).toLocaleString('en-IN',{maximumFractionDigits:1});
 return <div className="command-center">
  <div className="cc-heading"><div><span className="cc-eyebrow"><i/> CRESCENT CONTRACTORS · OPERATIONS INTELLIGENCE</span><h2>Operations Command Center</h2><p>One connected view of every project, yard, asset and movement.</p></div><div className="cc-live"><span className="cc-live-dot"/> LIVE DATABASE <button onClick={load}><RefreshCw size={14}/> Refresh</button></div></div>
  <div className="cc-top-metrics">
   <div><span><Boxes size={16}/> ASSET / STOCK UNITS</span><b>{number(total)}</b><small>{number(inuse)} in use · {number(yard)} in yard</small></div>
   <div><span><Building2 size={16}/> PROJECT SITES</span><b>{activeLocations.filter(x=>x.location_type==='PROJECT_SITE').length}</b><small>{activeLocations.length} active locations overall</small></div>
   <div><span><Truck size={16}/> FLEET</span><b>{activeFleet.length}</b><small>{activeDispatches.length} open dispatches</small></div>
   <div><span><ClipboardList size={16}/> REQUESTS</span><b>{openRequests.length}</b><small>Awaiting completion / review</small></div>
   <div><span><Fuel size={16}/> PLANT & FUEL</span><b>{d.equipment.length}</b><small>{pendingIssues.length} fuel issues pending approval</small></div>
  </div>
  <div className="cc-main-grid">
   <aside className="cc-left-rail">
    <section className="cc-panel"><header><Activity size={15}/> LIVE ASSET STATUS</header><div className="cc-gauge-row"><div className="cc-ring" style={{'--value':(total?Math.round(inuse/total*100):0)+'%'}}><b>{total?Math.round(inuse/total*100):0}%</b></div><div><b>{number(inuse)}</b><small>In-use quantity</small><span className="cc-progress"><i style={{width:(total?inuse/total*100:0)+'%'}}/></span><b>{number(maint)}</b><small>Under maintenance</small></div></div></section>
    <section className="cc-panel"><header><Truck size={15}/> FLEET & EQUIPMENT</header><div className="cc-statline"><span>Registered vehicles</span><b>{activeFleet.length}</b></div><div className="cc-statline"><span>Plant equipment</span><b>{d.equipment.length}</b></div><div className="cc-statline"><span>Open dispatches</span><b>{activeDispatches.length}</b></div><div className="cc-statline"><span>Hire / owned plant</span><b>{d.equipment.filter(x=>String(x.ownership_type||'').toUpperCase()==='HIRED').length} / {d.equipment.filter(x=>String(x.ownership_type||'').toUpperCase()!=='HIRED').length}</b></div></section>
    <section className="cc-panel"><header><Fuel size={15}/> PLANT & FUEL CONTROL</header><div className="cc-statline"><span>Diesel drums</span><b>{d.drums.length}</b></div><div className="cc-statline"><span>Fuel issues pending</span><b className={pendingIssues.length?'cc-warn':''}>{pendingIssues.length}</b></div><div className="cc-statline"><span>Approved fuel issues</span><b>{approvedIssues.length}</b></div><div className="cc-statline"><span>Daily meter entries</span><b>{d.readings.length}</b></div><button className="cc-panel-link" onClick={()=>onNavigate('Plant & Fuel Management')}>Open Plant & Fuel <ArrowUpRight size={13}/></button></section>
   </aside>
   <section className="cc-world-column">
    <IsometricScene projects={d.projects} locations={d.locations} vehicles={d.vehicles} movements={d.movements} balances={d.balances} items={d.items} challans={d.challans} onNavigate={onNavigate}/>
    <div className="cc-lower-grid"><section className="cc-panel"><header><ArrowLeftRight size={15}/> RECENT MOVEMENTS <button onClick={()=>onNavigate('Movements & Challans')}>View all <ArrowUpRight size={13}/></button></header>{latest.map(x=><div className="cc-list-row" key={x.id}><span className="cc-row-icon"><Truck size={14}/></span><div><b>{String(x.movement_type||'Stock movement').replaceAll('_',' ')}</b><small>{x.movement_number||'Movement recorded'}</small></div><time>{x.movement_date?new Date(x.movement_date).toLocaleDateString('en-IN'):'—'}</time></div>)}{!latest.length&&<p className="cc-empty">No movements recorded yet.</p>}</section>
    <section className="cc-panel"><header><Boxes size={15}/> RECENT ASSETS <button onClick={()=>onNavigate('Asset Register')}>View all <ArrowUpRight size={13}/></button></header>{recentAssets.map(x=><div className="cc-list-row" key={x.id}><span className="cc-row-icon"><Package size={14}/></span><div><b>{x.item_code||'Asset'} · {x.item_name}</b><small>{x.item_categories?.category_name||x.default_specification||'Asset record'}</small></div><time>{x.created_at?new Date(x.created_at).toLocaleDateString('en-IN'):'—'}</time></div>)}{!recentAssets.length&&<p className="cc-empty">No assets registered yet.</p>}</section></div>
   </section>
   <aside className="cc-right-rail"><section className="cc-panel cc-alert-panel"><header><Bell size={15}/> REQUESTS & ALERTS <span>{alerts.length}</span></header><div className="cc-alert-tabs"><span className="active">Activity</span><span>Requests</span><span>Plant & fuel</span></div>{alerts.map(a=><div className="cc-alert" key={a.kind+a.id}><i className={a.kind}/><div><b>{a.title}</b><small>{a.detail} · {a.location}</small><em>{a.status}</em></div><AlertTriangle size={14}/></div>)}{!alerts.length&&<p className="cc-empty">No pending requests or operational alerts.</p>}<button className="cc-panel-link" onClick={()=>onNavigate('Approvals')}>Open approvals & alerts <ArrowUpRight size={13}/></button></section>
    <section className="cc-panel"><header><MapPin size={15}/> NETWORK SNAPSHOT</header><div className="cc-statline"><span>Active projects</span><b>{d.projects.filter(x=>String(x.status||'').toUpperCase()==='ACTIVE').length}</b></div><div className="cc-statline"><span>Active locations</span><b>{activeLocations.length}</b></div><div className="cc-statline"><span>Material catalogue</span><b>{d.items.length}</b></div><div className="cc-statline"><span>Recent stock movements</span><b>{d.movements.length}</b></div></section>
   </aside>
  </div>
  <div className="cc-footer"><span>© 2026 Crescent Contractors Pvt. Ltd.</span><span>{busy?'Synchronising records…':'Connected to Crescent operational database'}</span></div>
 </div>;
}
