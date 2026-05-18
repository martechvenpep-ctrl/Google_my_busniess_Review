import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Cpu, Save, ShieldAlert, Sparkles, Clock, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export default function Automations() {
  const { automations, saveAutomations } = useContext(AppContext);

  // Component states corresponding to configurations
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(automations.autoReplyEnabled);
  const [autoReplyMinRating, setAutoReplyMinRating] = useState(automations.autoReplyMinRating);
  const [autoReplyDelayMinutes, setAutoReplyDelayMinutes] = useState(automations.autoReplyDelayMinutes);
  const [defaultTone, setDefaultTone] = useState(automations.defaultTone);
  const [useEmojis, setUseEmojis] = useState(automations.useEmojis);
  const [negativeEscalationEnabled, setNegativeEscalationEnabled] = useState(automations.negativeEscalationEnabled);
  const [escalationEmail, setEscalationEmail] = useState(automations.escalationEmail);

  const handleSave = () => {
    saveAutomations({
      autoReplyEnabled,
      autoReplyMinRating: parseInt(autoReplyMinRating),
      autoReplyDelayMinutes: parseInt(autoReplyDelayMinutes),
      defaultTone,
      useEmojis,
      negativeEscalationEnabled,
      escalationEmail
    });
  };

  return (
    <div className="automations-page animate-fade-in">
      <Header title="Automation Workflows" />

      <div className="automation-cards-grid">
        {/* Core AI Pilot Engine Rule Switch */}
        <div className="automation-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <div className="header-info">
              <Cpu size={22} className="glow-brand-icon" />
              <div>
                <h3>AI Autopilot Review Responses</h3>
                <p>Configure guidelines for the AI engine to generate and publish customer replies automatically</p>
              </div>
            </div>
            {/* Auto Reply Master Toggle */}
            <div className="switch-toggle-wrapper">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autoReplyEnabled}
                  onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className={`switch-status-label ${autoReplyEnabled ? 'active' : ''}`}>
                {autoReplyEnabled ? 'AUTOPILOT ON' : 'AUTOPILOT OFF'}
              </span>
            </div>
          </div>

          <div className="card-body-form">
            <div className="form-row-grid">
              
              {/* Star threshold */}
              <div className="form-control-item">
                <label>Minimum Star Rating to Auto-Reply:</label>
                <p className="field-explanation">Reviews with ratings at or above this threshold will trigger auto-replies. Below this will hold for manual reviews.</p>
                <select 
                  value={autoReplyMinRating} 
                  onChange={(e) => setAutoReplyMinRating(e.target.value)}
                  disabled={!autoReplyEnabled}
                >
                  <option value="5">Only 5 Stars (Strict Positive)</option>
                  <option value="4">4 Stars & Above (Standard Positive)</option>
                  <option value="3">3 Stars & Above (Neutral/Positive)</option>
                  <option value="2">2 Stars & Above (Include Minor Complaints)</option>
                </select>
              </div>

              {/* Natural delay timer */}
              <div className="form-control-item">
                <label>Natural Posting Delay (Minutes):</label>
                <p className="field-explanation">Inject a natural delay before publishing reviews to simulate deliberate human operator processing.</p>
                <div className="input-with-unit">
                  <input 
                    type="number" 
                    min="1" 
                    max="120"
                    value={autoReplyDelayMinutes} 
                    onChange={(e) => setAutoReplyDelayMinutes(e.target.value)}
                    disabled={!autoReplyEnabled}
                  />
                  <span className="unit-label">minutes</span>
                </div>
              </div>

              {/* Default Tone settings */}
              <div className="form-control-item">
                <label>Default AI Persona Tone:</label>
                <p className="field-explanation">Define the primary personality to reflect throughout automated review completions.</p>
                <select 
                  value={defaultTone} 
                  onChange={(e) => setDefaultTone(e.target.value)}
                  disabled={!autoReplyEnabled}
                >
                  <option value="friendly">Friendly & Energetic (Great for cafes/retails)</option>
                  <option value="professional">Professional & Direct (Great for corporate B2B)</option>
                  <option value="premium">Premium & Luxurious (Great for boutique/boutiques)</option>
                  <option value="casual">Casual & Relaxed (Great for clubs/lounges)</option>
                </select>
              </div>

              {/* Emoji preferences toggles */}
              <div className="form-control-item checkbox-alignment">
                <label>Emoji Character Controls:</label>
                <p className="field-explanation">Allow AI models to insert contextual emoji symbols (e.g. ☕, ✨, ✨💎) into review responses.</p>
                <div className="toggle-switch-card">
                  <input 
                    type="checkbox" 
                    id="emoji-ctrl-chk" 
                    checked={useEmojis}
                    onChange={(e) => setUseEmojis(e.target.checked)}
                    disabled={!autoReplyEnabled}
                  />
                  <label htmlFor="emoji-ctrl-chk" className="inline-chk-label">Include contextual Emojis inside drafts</label>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Threat Escalation Workflow Cards */}
        <div className="automation-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <div className="header-info">
              <ShieldAlert size={22} className="glow-alert-icon" />
              <div>
                <h3>Negative Review Escalation & Alerting</h3>
                <p>Safeguard brand reputation by routing poor comments (1-2 stars) immediately to team support queues</p>
              </div>
            </div>
            <div className="switch-toggle-wrapper">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={negativeEscalationEnabled}
                  onChange={(e) => setNegativeEscalationEnabled(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className={`switch-status-label ${negativeEscalationEnabled ? 'active' : ''}`}>
                {negativeEscalationEnabled ? 'ESCALATION ACTIVE' : 'ESCALATION OFF'}
              </span>
            </div>
          </div>

          <div className="card-body-form">
            <div className="form-row-grid">
              
              {/* Supervisor routing email */}
              <div className="form-control-item col-span-2">
                <label>Supervisor Routing Escalation Email:</label>
                <p className="field-explanation">We will dispatch full sentiment breakdowns and complaint alerts here instantly upon receipt of a negative review.</p>
                <input 
                  type="email" 
                  value={escalationEmail} 
                  onChange={(e) => setEscalationEmail(e.target.value)}
                  disabled={!negativeEscalationEnabled}
                  placeholder="escalations@yourbrand.com"
                  className="full-width-text-input"
                />
              </div>

              {/* Alert channels notifications */}
              <div className="form-control-item">
                <label>Active Routing Channels:</label>
                <p className="field-explanation">Distribute escalation ticket payloads across following linked systems:</p>
                <div className="checkbox-multi-grid">
                  <div className="multi-chk-item">
                    <input type="checkbox" id="c-email" defaultChecked disabled={!negativeEscalationEnabled} />
                    <label htmlFor="c-email">Email Notification alerts</label>
                  </div>
                  <div className="multi-chk-item">
                    <input type="checkbox" id="c-slack" defaultChecked disabled={!negativeEscalationEnabled} />
                    <label htmlFor="c-slack">Slack Channel Alerts (Instantly connected)</label>
                  </div>
                  <div className="multi-chk-item">
                    <input type="checkbox" id="c-whatsapp" disabled={!negativeEscalationEnabled} />
                    <label htmlFor="c-whatsapp">WhatsApp Manager Dispatch (Disconnected)</label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Form Action Footer panel */}
        <div className="form-footer-action-panel col-span-2">
          <button className="save-automation-settings-btn" onClick={handleSave}>
            <Save size={16} />
            <span>Save Active Automation Configurations</span>
          </button>
        </div>

      </div>

      {/* Workflow Previews Diagram */}
      <section className="workflow-diagram-card glass-panel col-span-2">
        <div className="diagram-header">
          <Sparkles size={18} className="glow-brand-icon" />
          <h3>Active Review Reputations Pipeline Workflow</h3>
        </div>
        <div className="pipeline-flowchart-row">
          <div className="flow-step">
            <div className="step-num">1</div>
            <h4>Sync New Review</h4>
            <p>GBP Webhook catches review instantly</p>
          </div>
          <div className="flow-arrow"><ArrowRight size={18} /></div>

          <div className="flow-step">
            <div className="step-num">2</div>
            <h4>AI Semantic Analysis</h4>
            <p>Score sentiment, extract smart tags & intent</p>
          </div>
          <div className="flow-arrow"><ArrowRight size={18} /></div>

          <div className="flow-step step-branching">
            <div className="step-num">3</div>
            <h4>Autopilot Branch</h4>
            <p>Rating {`>=`} {autoReplyMinRating}★ ? Auto reply generated in {defaultTone} tone.</p>
            <p className="flow-sub-text">Else: Escalate to supervisor email</p>
          </div>
          <div className="flow-arrow"><ArrowRight size={18} /></div>

          <div className="flow-step">
            <div className="step-num">4</div>
            <h4>Delay & Post</h4>
            <p>Wait {autoReplyDelayMinutes} mins and publish reply to Google</p>
          </div>
        </div>
      </section>
    </div>
  );
}
