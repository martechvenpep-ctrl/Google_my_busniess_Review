import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { setActivePage, addToast } = useContext(AppContext);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !company) return;
    
    addToast('Provisioning new tenant workspace...', 'info');
    
    setTimeout(() => {
      setActivePage('dashboard');
      addToast('Tenant cluster successfully deployed. Trial Active!', 'success');
    }, 1500);
  };

  return (
    <div className="auth-landing-page animate-fade-in">
      <div className="auth-branding-panel">
        <div className="brand-landing-glow"></div>
        <div className="branding-logo-wrapper">
          <Sparkles className="logo-sparkle-brand" size={32} />
          <h2>AI ReviewPilot</h2>
        </div>
        <h3>Deploy Your AI Reputation Engine in Under 2 Minutes.</h3>
        <p>Connect your business locations, synchronize customer reviews automatically, and let advanced GPT-4 models automate user replies with premium luxury and friendly voices.</p>

        <div className="signup-perks-bullets">
          <div className="perk-item">✓ <strong>14-Day Full Access Trial</strong> (No Credit Card required)</div>
          <div className="perk-item">✓ <strong>GPT-4 Omni & Gemini Pro</strong> response engines active</div>
          <div className="perk-item">✓ <strong>Stripe Billing Integration</strong> ready for auto-invoices</div>
        </div>

        <div className="branding-footer">
          <p>© 2026 AI ReviewPilot Inc. All rights reserved.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card glass-panel">
          <div className="form-heading">
            <h2>Start Free Trial</h2>
            <p>Deploy your automated reputation workspace</p>
          </div>

          <form onSubmit={handleSignupSubmit}>
            <div className="input-group">
              <label>Administrator Full Name:</label>
              <div className="input-field-wrapper">
                <User size={16} className="field-icon-svg" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="James Carter"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Organization / Company Name:</label>
              <div className="input-field-wrapper">
                <Briefcase size={16} className="field-icon-svg" />
                <input 
                  type="text" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="Broadway Cafes Inc."
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Work Email Address:</label>
              <div className="input-field-wrapper">
                <Mail size={16} className="field-icon-svg" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="james@broadwaycafes.com"
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Deploy Trial Workspace</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-foot-redirect">
            Already have a workspace? <button className="redirect-link-btn" onClick={() => setActivePage('login')}>Sign In here</button>
          </p>
        </div>
      </div>
    </div>
  );
}
