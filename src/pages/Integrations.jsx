import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Boxes, Sparkles, MessageSquare, ShieldAlert, Cpu, Database } from 'lucide-react';

const Facebook = ({ size = 22, style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={style}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Integrations() {
  const { 
    integrations, 
    toggleIntegrationStatus, 
    disconnectGoogleProfile,
    initiateGoogleOAuth,
    facebookPages,
    facebookSelectedPages,
    setFacebookSelectedPages,
    initiateFacebookOAuth,
    disconnectFacebookProfile
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
                  {integration.id === 'facebook' && <Facebook size={22} />}
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

                {/* --- FACEBOOK PAGES INTEGRATION CARD --- */}
                {integration.id === 'facebook' && (
                  <div className="gmb-custom-integration-box">
                    {!isConnected ? (
                      <div className="gmb-disconnected-flow">
                        <p className="gmb-clean-descriptor">
                          Connect your business Facebook Pages to start automating review replies.
                        </p>
                        <div className="google-auth-button-container">
                          <button className="fb-signin-btn" onClick={initiateFacebookOAuth} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1877f2', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                            <Facebook size={18} style={{ marginRight: '8px', fill: 'white' }} />
                            <span>Connect Facebook</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="gmb-connected-flow animate-fade-in">
                        <div className="fb-clean-success-box" style={{ backgroundColor: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span className="success-g-dot" style={{ color: '#1877f2' }}>●</span>
                          <span>Autopilot connected. Sync and review automation parameters are active in your Reviews Inbox.</span>
                        </div>
                        
                        <div className="gmb-card-actions-grid">
                          <button className="gmb-disconnect-now-btn width-full" onClick={disconnectFacebookProfile}>
                            Disconnect Facebook Account
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons for OTHER normal integrations */}
              {integration.id !== 'google' && integration.id !== 'facebook' && (
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
