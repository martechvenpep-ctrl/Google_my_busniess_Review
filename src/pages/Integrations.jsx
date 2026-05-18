import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Boxes, Sparkles, MessageSquare, ShieldAlert, Cpu, Database } from 'lucide-react';

export default function Integrations() {
  const { 
    integrations, 
    toggleIntegrationStatus, 
    disconnectGoogleProfile,
    initiateGoogleOAuth
  } = useContext(AppContext);

  return (
    <div className="integrations-page animate-fade-in">
      <Header title="System Integrations" />

      {/* Grid of integrations */}
      <section className="integrations-cards-grid">
        
        {integrations.map(integration => {
          const isConnected = integration.status === 'CONNECTED';
          
          return (
            <div key={integration.id} className={`integration-card glass-panel ${isConnected ? 'card-connected-glow' : ''}`}>
              <div className="card-top-header">
                <div className={`integration-icon-orb orb-${integration.id}`}>
                  {integration.id === 'google' && <MessageSquare size={22} />}
                  {integration.id === 'openai' && <Sparkles size={22} />}
                  {integration.id === 'gemini' && <Cpu size={22} />}
                  {integration.id === 'slack' && <ShieldAlert size={22} />}
                  {integration.id === 'stripe' && <Database size={22} />}
                  {integration.id === 'whatsapp' && <MessageSquare size={22} />}
                  {integration.id === 'zapier' && <Boxes size={22} />}
                  {integration.id === 'hubspot' && <Boxes size={22} />}
                </div>

                <div className={`connection-status-pill ${isConnected ? 'c-connected' : 'c-disconnected'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>

              <div className="card-body">
                <h3>{integration.name}</h3>
                <p>{integration.description}</p>

                {/* --- GOOGLE BUSINESS PROFILE CLEANED INTEGRATION CARD --- */}
                {integration.id === 'google' && (
                  <div className="gmb-custom-integration-box">
                    
                    {!isConnected ? (
                      /* Disconnected state: ONLY the Google Sign in Button! */
                      <div className="gmb-disconnected-flow">
                        <p className="gmb-clean-descriptor">
                          Click below to sign in securely with your Google Workspace Account.
                        </p>
                        <div className="google-auth-button-container">
                          <button className="google-signin-btn" onClick={initiateGoogleOAuth}>
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                              alt="Google G Logo" 
                              className="google-btn-logo" 
                            />
                            <span>Sign in Google</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Connected state: Clean active alert and disconnect controls */
                      <div className="gmb-connected-flow animate-fade-in">
                        <div className="gmb-clean-success-box">
                          <span className="success-g-dot">●</span>
                          <span>Autopilot synchronized. Sync controls are now active directly on your Reviews Inbox page.</span>
                        </div>
                        
                        <div className="gmb-card-actions-grid">
                          <button className="gmb-disconnect-now-btn width-full" onClick={disconnectGoogleProfile}>
                            Disconnect Google Account
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Action buttons for OTHER normal integrations */}
              {integration.id !== 'google' && (
                <div className="card-actions">
                  <button 
                    className={isConnected ? 'disconnect-btn' : 'connect-btn'}
                    onClick={() => toggleIntegrationStatus(integration.id)}
                  >
                    {isConnected ? 'Disconnect Integration' : 'Connect Pipeline'}
                  </button>
                </div>
              )}
            </div>
          );
        })}

      </section>
    </div>
  );
}
