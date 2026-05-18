import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Mail, Lock, ShieldCheck, ArrowRight, Bot } from 'lucide-react';

export default function Login() {
  const { setActivePage, addToast } = useContext(AppContext);
  const [email, setEmail] = useState('james.carter@yourbrand.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    addToast('Authenticating session credentials...', 'info');
    
    setTimeout(() => {
      setActivePage('dashboard');
      addToast('Welcome back, James! Session authorized.', 'success');
    }, 1000);
  };

  return (
    <div className="auth-landing-page animate-fade-in">
      <div className="auth-branding-panel">
        <div className="brand-landing-glow"></div>
        <div className="branding-logo-wrapper">
          <Sparkles className="logo-sparkle-brand" size={32} />
          <h2>AI ReviewPilot</h2>
        </div>
        <h3>Automated Enterprise Review & Reputation Management Powered by AI.</h3>
        <p>Integrate physical location reviews, auto-respond with brand-voice custom AI models, and mitigate churn risk on absolute autopilot.</p>

        {/* Feature bullets */}
        <div className="landing-features-list">
          <div className="l-feat-item">
            <Bot size={18} />
            <span>Smart Sentiment & Threat Risk Engine</span>
          </div>
          <div className="l-feat-item">
            <Sparkles size={18} />
            <span>GPT-4 Powered Natural Brand Auto-Replies</span>
          </div>
          <div className="l-feat-item">
            <ShieldCheck size={18} />
            <span>Multi-location Google Business Profiles Handshake</span>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 AI ReviewPilot Inc. All rights reserved.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card glass-panel">
          <div className="form-heading">
            <h2>Welcome Back</h2>
            <p>Log in to your workspace dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label>Work Email Address:</label>
              <div className="input-field-wrapper">
                <Mail size={16} className="field-icon-svg" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Account Password:</label>
              <div className="input-field-wrapper">
                <Lock size={16} className="field-icon-svg" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div className="forgot-password-row">
              <span className="remember-checkbox-group">
                <input type="checkbox" id="remember-me" defaultChecked />
                <label htmlFor="remember-me">Remember Session</label>
              </span>
              <button type="button" className="forgot-link-btn" onClick={() => addToast('Password reset link sent to registered email.', 'info')}>Forgot Password?</button>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Sign In to Autopilot Workspace</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social login option */}
          <div className="oauth-divider-row">
            <span>or authorize via</span>
          </div>

          <button 
            type="button" 
            className="google-oauth-authorize-btn"
            onClick={handleLoginSubmit}
          >
            <span className="google-oauth-sim-icon">G</span>
            <span>Sign In with Google SSO Account</span>
          </button>

          <p className="auth-foot-redirect">
            Don't have a workspace? <button className="redirect-link-btn" onClick={() => setActivePage('signup')}>Register Trial Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}
