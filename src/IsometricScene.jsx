import React from 'react';
import { Building2, Construction, Truck, Warehouse } from 'lucide-react';

export default function IsometricScene({ projectCount = 0, locationCount = 0 }) {
  return <section className="iso-command-scene" aria-label="Illustrated construction operations overview">
    <div className="iso-scene-copy">
      <span className="iso-scene-eyebrow"><span className="iso-live-dot"/> OPERATIONS TERRAIN</span>
      <h3>One network.<br/><em>Every site in motion.</em></h3>
      <p>A strategic view of Crescent’s assets, yards and project operations.</p>
      <div className="iso-scene-stats">
        <span><b>{projectCount}</b><small>Projects</small></span>
        <span><b>{locationCount}</b><small>Locations</small></span>
      </div>
    </div>
    <div className="iso-world" aria-hidden="true">
      <div className="iso-world-glow"/>
      <div className="iso-grid-plane">
        <div className="iso-road iso-road-a"/>
        <div className="iso-road iso-road-b"/>
        <div className="iso-site iso-site-one">
          <div className="iso-platform"/>
          <div className="iso-building iso-building-main"><i/><i/><i/><i/><i/><i/></div>
          <div className="iso-building iso-building-low"/>
          <div className="iso-crane"><span/><i/><b/></div>
          <div className="iso-site-label"><Building2 size={13}/> PROJECT SITE</div>
        </div>
        <div className="iso-site iso-site-two">
          <div className="iso-platform"/>
          <div className="iso-warehouse"><i/><i/><i/></div>
          <div className="iso-site-label"><Warehouse size={13}/> CENTRAL YARD</div>
        </div>
        <div className="iso-truck"><Truck size={28}/><span/></div>
        <div className="iso-tower"><Construction size={18}/></div>
        <div className="iso-tree iso-tree-a"/><div className="iso-tree iso-tree-b"/><div className="iso-tree iso-tree-c"/>
        <span className="iso-route-pulse"/>
      </div>
      <div className="iso-scene-caption"><span/> LIVE OPERATIONS VIEW <b>ILLUSTRATIVE</b></div>
    </div>
  </section>;
}
