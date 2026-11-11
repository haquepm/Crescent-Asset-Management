import React,{useMemo,useState}from'react';import OperationsMap from './OperationsMap';import IsometricWorld from './IsometricWorld';
import{Building2,Warehouse,Truck,Boxes,ArrowLeftRight,MapPin,Activity,Package,HardHat,ChevronRight}from'lucide-react';

const number=v=>Number(v||0).toLocaleString('en-IN',{maximumFractionDigits:1});
const short=(s,n=22)=>String(s||'').length>n?String(s).slice(0,n-1)+'…':String(s||'');
export default function IsometricScene({projects=[],locations=[],vehicles=[],movements=[],balances=[],items=[],challans=[],onNavigate}){
 const[active,setActive]=useState(null);const[mapMode,setMapMode]=useState('iso');
 const activeLocations=useMemo(()=>locations.filter(x=>x.is_active!==false),[locations]);
 const siteStats=useMemo(()=>activeLocations.map(loc=>{
  const stock=balances.filter(x=>x.location_id===loc.id);
  const materialQty=stock.reduce((s,x)=>s+Number(x.quantity_on_hand||0),0);
  const skuCount=new Set(stock.filter(x=>Number(x.quantity_on_hand||0)>0).map(x=>x.item_id)).size;
  const activeMoves=movements.filter(x=>x.source_location_id===loc.id||x.destination_location_id===loc.id);
  const fleet=challans.filter(x=>[x.source_location_id,x.destination_location_id].includes(loc.id)&&!['RECEIVED','CANCELLED','CLOSED'].includes(String(x.status||'').toUpperCase()));
  return{...loc,materialQty,skuCount,activity:activeMoves.length,vehicles:fleet.length};
 }),[activeLocations,balances,movements,challans]);
 const selected=siteStats.find(x=>x.id===active)||null;
 const transferMoves=movements.filter(x=>x.source_location_id&&x.destination_location_id&&['TRANSFER_OUT','TRANSFER_IN','SITE_ISSUE','SITE_RETURN'].includes(x.movement_type)).slice(0,6);
 const totalMaterial=balances.reduce((s,x)=>s+Number(x.quantity_on_hand||0),0);
 const activeFleet=vehicles.filter(x=>x.is_active!==false);
 const moving=challans.filter(x=>!['RECEIVED','CANCELLED','CLOSED'].includes(String(x.status||'').toUpperCase()));
 const projectSites=activeLocations.filter(x=>x.location_type==='PROJECT_SITE').length;
 return <section className="iso-command-scene iso-game-shell" aria-label="Crescent live operations world">
  <div className="iso-game-top">
   <div><span className="iso-scene-eyebrow"><span className="iso-live-dot"/> CRESCENT OPERATIONS WORLD</span><h3>Every site. Every asset.<br/><em>One connected network.</em></h3><p>Explore project sites, yards, material positions and recorded vehicle movements across Crescent.</p></div>
   <div className="iso-game-stats">
    <div><Building2/><b>{projectSites}</b><small>Project sites</small></div>
    <div><Boxes/><b>{number(totalMaterial)}</b><small>Materials on hand</small></div>
    <div><Truck/><b>{activeFleet.length}</b><small>Registered vehicles</small></div>
    <div><ArrowLeftRight/><b>{moving.length}</b><small>Open dispatches</small></div>
   </div>
  </div>
  <div className="iso-game-layout">
   <div className="iso-game-map-wrap"><div className="iso-view-switch"><span>OPERATIONS VIEW</span><button className={mapMode==='iso'?"active":""} onClick={()=>setMapMode('iso')}>Isometric world</button><button className={mapMode==='geo'?"active":""} onClick={()=>setMapMode('geo')}>Geographic map</button></div>{mapMode==='iso'?<IsometricWorld locations={locations} projects={projects} balances={balances} items={items} challans={challans} selectedId={active} onSelectLocation={loc=>setActive(loc.id)}/>:<OperationsMap locations={locations} projects={projects} challans={challans} onSelectLocation={loc=>setActive(loc.id)}/>}</div>
   <aside className="iso-world-side">
    <div className="iso-side-head"><div><small>{selected?'LOCATION INTELLIGENCE':'NETWORK INTELLIGENCE'}</small><b>{selected?selected.location_name:'Operations overview'}</b></div><MapPin size={18}/></div>
    {selected?<><div className="iso-selected-type">{selected.location_type==='YARD'?'Storage & distribution yard':'Active construction site'}{selected.location_code?' · '+selected.location_code:''}</div><div className="iso-side-metrics"><div><b>{number(selected.materialQty)}</b><small>Material units</small></div><div><b>{selected.skuCount}</b><small>Material types</small></div><div><b>{selected.activity}</b><small>Movements logged</small></div><div><b>{selected.vehicles}</b><small>Open dispatches</small></div></div><div className="iso-material-list"><small>MATERIALS AT THIS LOCATION</small>{balances.filter(x=>x.location_id===selected.id&&Number(x.quantity_on_hand||0)>0).slice(0,5).map(x=><div key={x.id}><span>{short(items.find(i=>i.id===x.item_id)?.item_name||'Material',24)}</span><b>{number(x.quantity_on_hand)} {items.find(i=>i.id===x.item_id)?.unit||'units'}</b></div>)}{!balances.some(x=>x.location_id===selected.id&&Number(x.quantity_on_hand||0)>0)&&<span className="iso-no-data">No material balance recorded at this location.</span>}</div><div className="iso-side-detail"><small>PROJECT</small><b>{projects.find(p=>p.id===selected.project_id)?.project_name||'Shared / central location'}</b><small>ADDRESS</small><span>{selected.address||'Address not recorded'}</span><small>CONTACT</small><span>{selected.contact_person||'Not assigned'}{selected.contact_phone?' · '+selected.contact_phone:''}</span></div><button className="iso-side-action" onClick={()=>onNavigate?.('Locations')}>Open location register <ChevronRight size={15}/></button></>:<><div className="iso-side-metrics"><div><b>{activeLocations.length}</b><small>Active locations</small></div><div><b>{projects.filter(p=>p.status==='ACTIVE').length}</b><small>Active projects</small></div><div><b>{items.length}</b><small>Material catalogue</small></div><div><b>{movements.length}</b><small>Recent movements</small></div></div><div className="iso-side-detail"><small>NETWORK STATUS</small><span>Operational records are synced from the Crescent database. Select any site tile to inspect its materials and activity.</span></div><button className="iso-side-action" onClick={()=>onNavigate?.('Locations')}>Explore all locations <ChevronRight size={15}/></button></>}
   </aside>
  </div>
  <div className="iso-game-bottom">
   <div className="iso-fleet-strip"><div className="iso-strip-title"><Truck size={15}/><b>FLEET REGISTER</b><small>{activeFleet.length} active</small></div><div className="iso-fleet-items">{activeFleet.map(v=>{const trip=challans.find(c=>c.vehicle_number===v.registration_number&&!['RECEIVED','CANCELLED','CLOSED'].includes(String(c.status||'').toUpperCase()));return <span key={v.id} className={trip?'fleet-moving':''}><Truck size={14}/><b>{v.registration_number}</b><small>{trip?'Dispatch in progress':v.vehicle_type||'Vehicle'}</small></span>})}{!activeFleet.length&&<small className="iso-no-data">No vehicles registered.</small>}</div></div>
   <div className="iso-transfer-strip"><div className="iso-strip-title"><ArrowLeftRight size={15}/><b>RECENT TRANSFERS & MOVEMENTS</b><small>{transferMoves.length} shown</small></div><div className="iso-transfer-items">{transferMoves.slice(0,4).map(m=><span key={m.id}><b>{short(items.find(x=>x.id===m.item_id)?.item_name||m.movement_type?.replaceAll('_',' '),22)}</b><small>{short(locations.find(x=>x.id===m.source_location_id)?.location_name||'External',15)} → {short(locations.find(x=>x.id===m.destination_location_id)?.location_name||'External',15)}</small><em>{number(m.quantity)} units</em></span>)}{!transferMoves.length&&<small className="iso-no-data">No transfer movements recorded yet.</small>}</div></div>
  </div>
  <div className="iso-scene-caption"><span/> DATABASE-LINKED OPERATIONS VIEW <b>SELECT A SITE TO EXPLORE</b></div>
 </section>;
}
