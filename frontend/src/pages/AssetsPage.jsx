/*import React, { useState } from 'react';
import {
  Server,
  Search,
  Filter,
  Shield,
  Laptop,
  Database,
  Cloud,
  Globe,
  Cpu,
  Layers
} from 'lucide-react';

function getDeviceIcon(type) {
  switch (type) {
    case 'External Gateway':
      return Globe;
    case 'Firewall':
      return Shield;
    case 'Web Server':
      return Server;
    case 'Application Server':
      return Cpu;
    case 'Database Server':
      return Database;
    case 'Workstation':
      return Laptop;
    case 'Cloud Instance':
      return Cloud;
    default:
      return Server;
  }
}

export default function AssetsPage({ assets = [], onSelectAsset, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const zones = ['ALL', 'EXTERNAL', 'PERIMETER', 'DMZ', 'INTERNAL', 'INTERNAL_APP', 'SECURE_DATA', 'USER_LAN', 'PRIVILEGED_LAN', 'CLOUD_VPC'];

  const filteredAssets = assets.filter(a => {
    const matchesSearch =
      a.NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.IP_ADDRESS?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.OPERATING_SYSTEM?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ASSET_ID?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = zoneFilter === 'ALL' || a.ZONE === zoneFilter;

    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */
    /*}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Enterprise Asset Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directory of all network nodes modeled in the Digital Twin with zone microsegmentation parameters
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */
        /*}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets, IP, OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Zone Filter */
        /*}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assets Grid */
    /*}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          const Icon = getDeviceIcon(asset.DEVICE_TYPE);

          return (
            <div
              key={asset.ASSET_ID}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{asset.NAME}</h3>
                      <span className="text-[11px] text-slate-400 font-mono-code">{asset.IP_ADDRESS}</span>
                    </div>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono-code ${
                      asset.SECURITY_STATE === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : asset.SECURITY_STATE === 'HIGH_RISK'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {asset.SECURITY_STATE}
                  </span>
                </div>

                <div className="space-y-1.5 rounded-lg border border-slate-800 bg-slate-800/40 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Device Type:</span>
                    <span className="text-slate-200">{asset.DEVICE_TYPE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Zone:</span>
                    <span className="text-cyan-300 font-mono-code">{asset.ZONE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Criticality:</span>
                    <span className="text-rose-300 font-semibold">{asset.CRITICALITY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">OS:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{asset.OPERATING_SYSTEM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Open Ports:</span>
                    <span className="font-mono-code text-cyan-400">{asset.OPEN_PORTS || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Calculated Risk:</span>
                  <span className="font-bold font-mono-code text-rose-400">{asset.RISK_SCORE}%</span>
                </div>

                <button
                  onClick={() => {
                    if (onSelectAsset) onSelectAsset(asset);
                    onNavigate('digital-twin');
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  View on Twin
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

*/

import React, { useState } from 'react';
import {
  Server,
  Search,
  Shield,
  Laptop,
  Database,
  Cloud,
  Globe,
  Cpu,
  Layers
} from 'lucide-react';

function getDeviceIcon(type) {
  switch (type) {
    case 'External Gateway':
      return Globe;
    case 'Firewall':
      return Shield;
    case 'Web Server':
      return Server;
    case 'Application Server':
      return Cpu;
    case 'Database Server':
      return Database;
    case 'Workstation':
      return Laptop;
    case 'Cloud Instance':
      return Cloud;
    default:
      return Server;
  }
}

export default function AssetsPage({ assets = [], onSelectAsset, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const zones = [
    'ALL',
    'EXTERNAL',
    'PERIMETER',
    'DMZ',
    'INTERNAL',
    'INTERNAL_APP',
    'SECURE_DATA',
    'USER_LAN',
    'PRIVILEGED_LAN',
    'CLOUD_VPC'
  ];

  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      asset.name?.toLowerCase().includes(query) ||
      asset.ipAddress?.toLowerCase().includes(query) ||
      asset.operatingSystem?.toLowerCase().includes(query) ||
      asset.id?.toLowerCase().includes(query);

    const matchesZone =
      zoneFilter === 'ALL' || asset.zone === zoneFilter;

    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">

        <div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />

            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Enterprise Asset Inventory
            </h2>
          </div>

          <p className="text-xs text-slate-400 mt-0.5">
            Directory of all network nodes modeled in the Digital Twin with zone microsegmentation parameters
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

            <input
              type="text"
              placeholder="Search assets, IP, OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Asset Count */}
      <div className="text-xs text-slate-400">
        Showing <span className="text-cyan-400 font-bold">{filteredAssets.length}</span> of{' '}
        <span className="text-white font-bold">{assets.length}</span> assets
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {filteredAssets.map(asset => {

          const Icon = getDeviceIcon(asset.deviceType);

          return (
            <div
              key={asset.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700"
            >

              <div className="space-y-3">

                {/* Asset Header */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {asset.name}
                      </h3>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {asset.ipAddress}
                      </span>
                    </div>

                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono ${
                      asset.securityState === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : asset.securityState === 'HIGH_RISK'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : asset.securityState === 'MEDIUM_RISK'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {asset.securityState}
                  </span>

                </div>

                {/* Asset Details */}
                <div className="space-y-1.5 rounded-lg border border-slate-800 bg-slate-800/40 p-3 text-xs">

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Device Type:
                    </span>

                    <span className="text-slate-200">
                      {asset.deviceType}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Network Zone:
                    </span>

                    <span className="text-cyan-300 font-mono">
                      {asset.zone}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Criticality:
                    </span>

                    <span className="text-rose-300 font-semibold">
                      {asset.criticality}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">
                      OS:
                    </span>

                    <span className="text-slate-300 truncate max-w-[170px]">
                      {asset.operatingSystem}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Open Ports:
                    </span>

                    <span className="font-mono text-cyan-400">
                      {asset.openPorts?.join(', ') || 'None'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Vulnerabilities:
                    </span>

                    <span className="text-amber-300 font-semibold">
                      {asset.vulnerabilityCount}
                    </span>
                  </div>

                </div>

              </div>

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">

                <div className="flex items-center gap-1.5">

                  <span className="text-slate-400">
                    Calculated Risk:
                  </span>

                  <span className="font-bold font-mono text-rose-400">
                    {asset.riskScore}%
                  </span>

                </div>

                <button
                  onClick={() => {
                    if (onSelectAsset) {
                      onSelectAsset(asset);
                    }

                    if (onNavigate) {
                      onNavigate('digital-twin');
                    }
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  View on Twin
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <Server className="mx-auto h-10 w-10 text-slate-600" />

          <h3 className="mt-3 text-sm font-semibold text-white">
            No assets found
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Try changing the search term or zone filter.
          </p>
        </div>
      )}

    </div>
  );
}