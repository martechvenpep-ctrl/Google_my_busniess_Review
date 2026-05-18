import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { RefreshCw, MapPin, Sparkles, LogIn } from 'lucide-react';

export default function Header({ title }) {
  const { 
    locations, 
    activeLocationId, 
    setActiveLocationId, 
    syncReviews, 
    isSyncing,
    integrations
  } = useContext(AppContext);

  const googleConnected = integrations.find(i => i.id === 'google')?.status === 'CONNECTED';

  return (
    <header className="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">Automate your reputation engine with advanced AI</p>
      </div>

      <div className="header-right">
        {/* Location Selector */}
        <div className="header-location-selector-wrapper">
          <MapPin size={16} className="location-pin-icon" />
          <select 
            className="location-select"
            value={activeLocationId}
            onChange={(e) => setActiveLocationId(e.target.value)}
          >
            <option value="all">All Locations (4)</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.rating} ★)
              </option>
            ))}
          </select>
        </div>

        {/* Sync Button */}
        {googleConnected ? (
          <button 
            className={`sync-reviews-btn ${isSyncing ? 'syncing' : ''}`}
            onClick={syncReviews}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Reviews'}</span>
          </button>
        ) : (
          <div className="sync-reviews-disabled-tooltip">
            <span className="tooltip-indicator"></span>
            <span>Google Disconnected</span>
          </div>
        )}
      </div>
    </header>
  );
}
