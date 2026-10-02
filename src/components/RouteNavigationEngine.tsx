import React, { useState } from 'react';
import { Vehicle } from '../types';
import { 
  Navigation, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CloudSnow, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  Euro,
  CheckCircle2,
  Shuffle
} from 'lucide-react';
import { formatSpeed, formatCurrencyEur } from '../utils/formatters';

interface RouteNavigationEngineProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onApplyDetour: (vehicleId: string, reason: string) => void;
}

export const RouteNavigationEngine: React.FC<RouteNavigationEngineProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onApplyDetour,
}) => {
  const currentVehicle = vehicles.find((v) => v.vehicle_id === selectedVehicleId) || vehicles[0];

  // European commercial HGV restrictions state (Directive 96/53/EC & ADR)
  const [restrictions, setRestrictions] = useState({
    lowClearance: currentVehicle.active_route.restrictions.low_clearance,
    maxAxleWeight: currentVehicle.active_route.restrictions.max_axle_weight,
    adrRestricted: currentVehicle.active_route.restrictions.adr_restricted,
    critAirLez: currentVehicle.active_route.restrictions.crit_air_lez,
    alpineTransit: currentVehicle.active_route.restrictions.alpine_transit,
  });

  const [activeDetourState, setActiveDetourState] = useState<string | null>(null);

  const toggleRestriction = (key: keyof typeof restrictions) => {
    setRestrictions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRecalculateAlternate = () => {
    setActiveDetourState('CALCULATING EU TEN-T BYPASS CORRIDOR...');
    setTimeout(() => {
      onApplyDetour(
        currentVehicle.vehicle_id,
        'Applied German BAB 61 / A6 bypass to avoid bridge weight restriction and A3 congestion'
      );
      setActiveDetourState('ALTERNATE TEN-T ROUTE DEPLOYED // TACHO & LKW MAUT UPDATED (+18 km, 0 Conflicts)');
      setTimeout(() => setActiveDetourState(null), 5000);
    }, 800);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-300 shadow-sm p-5 font-sans space-y-5">
      {/* Module Title */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-300 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              European TEN-T Route Navigation & Detour Engine
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Directive 96/53/EC Commercial Clearances · LKW-Maut & EETS Tolling · Alpine Pass Transit Curfews
            </p>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Active HGV:</span>
          <select
            value={currentVehicle.vehicle_id}
            onChange={(e) => onSelectVehicle(e.target.value)}
            className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 shadow-2xs font-semibold"
          >
            {vehicles.map((v) => (
              <option key={v.vehicle_id} value={v.vehicle_id}>
                {v.vehicle_id} ({v.plate_number}) - {v.active_route.origin_id} → {v.active_route.destination_id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Origin / Destination Primary Metric Banner */}
      <div className="p-4 bg-slate-100/70 border border-slate-300 rounded-xl space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/80 pb-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Origin (EU):</span>
              <div className="text-slate-900 font-bold text-base">{currentVehicle.active_route.origin_name}</div>
            </div>
            <span className="text-slate-400 font-bold text-lg">───────►</span>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Destination (EU):</span>
              <div className="text-slate-900 font-bold text-base">{currentVehicle.active_route.destination_name}</div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Corridor Distance:</span>
              <span className="text-slate-900 font-bold text-sm font-mono">{currentVehicle.active_route.total_distance_km} km</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Est. Drive Time:</span>
              <span className="text-emerald-700 font-bold text-sm">{currentVehicle.active_route.est_time_remaining}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">EU Tolls (Maut/Telepass):</span>
              <span className="text-blue-700 font-bold text-sm font-mono">{formatCurrencyEur(currentVehicle.active_route.toll_cost_eur)}</span>
            </div>
          </div>
        </div>

        {/* European Restrictions Filter Bar */}
        <div>
          <div className="text-[11px] text-slate-700 mb-2 uppercase tracking-wide font-bold">
            European Directive 96/53/EC & Environmental Constraints:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
            <button
              onClick={() => toggleRestriction('lowClearance')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                restrictions.lowClearance
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-2xs font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
              }`}
            >
              {restrictions.lowClearance ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Clearance (&lt; 4.00m Standard)</span>
            </button>

            <button
              onClick={() => toggleRestriction('maxAxleWeight')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                restrictions.maxAxleWeight
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-2xs font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
              }`}
            >
              {restrictions.maxAxleWeight ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Drive Axle (&lt; 11.5t Limit)</span>
            </button>

            <button
              onClick={() => toggleRestriction('adrRestricted')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                restrictions.adrRestricted
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-2xs font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
              }`}
            >
              {restrictions.adrRestricted ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>ADR Tunnels (Cat B/E)</span>
            </button>

            <button
              onClick={() => toggleRestriction('critAirLez')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                restrictions.critAirLez
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-2xs font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
              }`}
            >
              {restrictions.critAirLez ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Crit'Air / LEZ Zones</span>
            </button>

            <button
              onClick={() => toggleRestriction('alpineTransit')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                restrictions.alpineTransit
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-950 shadow-2xs font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs font-medium'
              }`}
            >
              {restrictions.alpineTransit ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Alpine Sectoral Ban (Brenner)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Route Segments Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Segment Turn-by-Turn & Architecture */}
        <div className="p-4 bg-slate-100/70 border border-slate-300 rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <span className="font-bold text-xs text-slate-900 tracking-tight">
              TEN-T Corridor Topology & Segments
            </span>
            <span className="text-slate-600 font-semibold text-xs">
              40 Tonnes / 16.5m Articulated
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-2xs">
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                <span>1. Cross-Country Motorway Axis (TEN-T Priority)</span>
                <span className="text-blue-700 font-mono font-bold">{Math.round(currentVehicle.active_route.total_distance_km * 0.8)} km @ {currentVehicle.active_route.avg_speed_kmh} km/h avg</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimized for German LKW Maut / French Telepass OBU electronic tolling, automated WIM (weigh-in-motion), and Euro 6e low acoustic footprint.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-2xs">
              <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                <span>2. Urban Distripark & Terminal Access</span>
                <span className="text-blue-700 font-mono font-bold">{Math.round(currentVehicle.active_route.total_distance_km * 0.2)} km @ 45 km/h avg</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complies with European municipal delivery windows, Crit'Air vignette class 1/2, and bridge underpass clearances &gt; 4.10m.
              </p>
            </div>
          </div>

          {/* Waypoints sequence */}
          <div className="pt-2 border-t border-slate-300">
            <div className="text-[11px] text-slate-600 font-bold mb-1.5 uppercase">
              European Waypoints & Toll Hubs:
            </div>
            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs">
              {currentVehicle.active_route.waypoints.map((wp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-mono font-bold text-[11px]">[{wp.country}]</span>
                    <span className="text-slate-900 font-medium">{wp.name}</span>
                  </div>
                  <span className="text-slate-500 uppercase text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                    {wp.type || 'WAYPOINT'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Alpine & Weather Radar */}
        <div className="p-4 bg-slate-100/70 border border-slate-300 rounded-xl space-y-3 flex flex-col justify-between shadow-2xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2">
              <span className="font-bold text-xs text-slate-900 tracking-tight flex items-center gap-1.5">
                <CloudSnow className="w-4 h-4 text-blue-600" />
                Live Alpine Weather & Pass Radar
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                Advisory Active
              </span>
            </div>

            {/* Alpine Status Card */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Brenner Pass (A13 / A22): Snow Chain Requirement & Sectoral Ban</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Alpine elevation 1,374m: Heavy snowfall between Innsbruck and Bolzano. Mandatory snow chain fitment for drive axles (&gt;3.5t). Sectoral transit ban active for non-Euro 6e freight combinations.
              </p>
              <div className="text-[11px] text-amber-800 font-semibold pt-1 border-t border-amber-300/60">
                Impact: +45m transit delay on direct Verona vector.
              </div>
            </div>

            {/* Alternate Recommendation */}
            <div className="p-3.5 bg-white border border-slate-300 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Recommended European Detour:</span>
                <span className="text-emerald-700 font-semibold text-[11px]">Clean Clearance</span>
              </div>
              <p className="text-xs text-slate-600">
                Reroute via Tauern Autobahn (A10) or Swiss Gotthard Tunnel corridor. Clears all low emission restrictions and bypasses Kufstein block handling.
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-slate-300 space-y-2">
            {activeDetourState && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{activeDetourState}</span>
              </div>
            )}

            <button
              onClick={handleRecalculateAlternate}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white border border-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>Deploy Alternate TEN-T Bypass Route to HGV Cab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
