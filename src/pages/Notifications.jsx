import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Bell, Save, MessageSquare, Mail, MessageCircle, AlertTriangle } from 'lucide-react';

export default function Notifications() {
  const { addToast } = useContext(AppContext);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [telegramAlerts, setTelegramAlerts] = useState(false);
  const [digestDaily, setDigestDaily] = useState(true);

  const handleSave = () => {
    addToast('Notification channels updated.', 'success');
  };

  return (
    <div className="notifications-settings-page animate-fade-in">
      <Header title="Notification Settings" />

      <div className="notifications-cards-grid">
        
        {/* Alerts channels config */}
        <div className="notifications-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <Bell className="glow-brand-icon" size={22} />
            <div>
              <h3>Real-Time Alerts Dispatch</h3>
              <p>Configure notification routing channels for negative reviews and system status changes</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="notification-checkboxes-list">
              
              {/* Slack */}
              <div className="channel-toggle-row-item">
                <div className="channel-meta-left">
                  <div className="channel-icon-circle bg-slack"><MessageSquare size={18} /></div>
                  <div className="channel-desc">
                    <h4>Slack Channel Dispatch</h4>
                    <p>Post interactive cards to Slack channels when a negative review is detected</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={slackAlerts} onChange={(e) => setSlackAlerts(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* Email */}
              <div className="channel-toggle-row-item">
                <div className="channel-meta-left">
                  <div className="channel-icon-circle bg-email"><Mail size={18} /></div>
                  <div className="channel-desc">
                    <h4>Supervisor Email Escalations</h4>
                    <p>Send detailed complaint summaries to your escalations mailbox</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* WhatsApp */}
              <div className="channel-toggle-row-item">
                <div className="channel-meta-left">
                  <div className="channel-icon-circle bg-whatsapp"><MessageCircle size={18} /></div>
                  <div className="channel-desc">
                    <h4>WhatsApp SMS Alerts</h4>
                    <p>Escalate poor reviews to mobile phone contacts instantly (Requires WhatsApp Premium)</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={whatsappAlerts} onChange={(e) => setWhatsappAlerts(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* Telegram */}
              <div className="channel-toggle-row-item">
                <div className="channel-meta-left">
                  <div className="channel-icon-circle bg-telegram"><Bell size={18} /></div>
                  <div className="channel-desc">
                    <h4>Telegram Bot Prompter</h4>
                    <p>Ping group chats via custom telegram webhook bots (Requires setup)</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={telegramAlerts} onChange={(e) => setTelegramAlerts(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* AI digest digests */}
        <div className="notifications-main-card glass-panel col-span-2">
          <div className="card-top-header">
            <AlertTriangle className="glow-brand-icon" size={22} />
            <div>
              <h3>Daily AI Summary Digests</h3>
              <p>Receive comprehensive, high-level intelligence reports compiling total reviews statistics, sentiment changes, and complain trends</p>
            </div>
          </div>

          <div className="card-body-form">
            <div className="channel-toggle-row-item border-none">
              <div className="channel-meta-left">
                <div className="channel-desc">
                  <h4>Email Daily Reputation Report</h4>
                  <p>Delivered at 8:00 AM every morning with weekly projections and AI customer insights summaries</p>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={digestDaily} onChange={(e) => setDigestDaily(e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="form-footer-action-panel col-span-2">
          <button className="save-notification-btn" onClick={handleSave}>
            <Save size={16} />
            <span>Update Notification Channels</span>
          </button>
        </div>

      </div>
    </div>
  );
}
