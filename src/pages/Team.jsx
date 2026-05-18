import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Users, UserPlus, Trash2, Mail, ShieldAlert } from 'lucide-react';

export default function Team() {
  const { team, inviteTeamMember, removeTeam } = useContext(AppContext);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Support Agent');

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="team-page animate-fade-in">
      <Header title="Team Management" />

      {/* Team settings wrapper */}
      <section className="team-content-area glass-panel">
        <div className="card-top-header">
          <div className="header-info">
            <Users size={22} className="glow-brand-icon" />
            <div>
              <h3>Organization Members</h3>
              <p>Manage workspace access, set roles permissions, and invite new operators</p>
            </div>
          </div>
          <button className="invite-member-trigger-btn" onClick={() => setShowInviteModal(true)}>
            <UserPlus size={16} />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Teammates List Table */}
        <div className="team-list-table-wrapper">
          <table className="custom-dashboard-table">
            <thead>
              <tr>
                <th>Member Operator</th>
                <th>Email Address</th>
                <th>Permission Role</th>
                <th>Account Status</th>
                <th>System Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="teammate-avatar-group">
                      <div className="teammate-avatar-circle">{member.avatar}</div>
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`role-pill role-${member.role.toLowerCase().replace(' ', '-')}`}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-teammate-pill stat-${member.status.toLowerCase()}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    {member.email !== 'james@areviewpilot.com' ? (
                      <button className="remove-teammate-btn" onClick={() => removeTeam(member.id)}>
                        <Trash2 size={15} />
                        <span>Revoke Access</span>
                      </button>
                    ) : (
                      <span className="owner-action-label">Organization Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invite Member Popup Modal */}
      {showInviteModal && (
        <div className="modal-overlay animate-fade-in">
          <form className="modal-card glass-panel" onSubmit={handleInviteSubmit}>
            <div className="modal-header">
              <h3>Invite Workspace Teammate</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowInviteModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label>Full Operator Name:</label>
                <input 
                  type="text" 
                  value={inviteName} 
                  onChange={(e) => setInviteName(e.target.value)} 
                  placeholder="E.g. Sophia Loren"
                  required
                />
              </div>

              <div className="input-group">
                <label>Company Email Address:</label>
                <input 
                  type="email" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  placeholder="sophia@brandcafe.com"
                  required
                />
              </div>

              <div className="input-group">
                <label>Role / Permissions Level:</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="Admin">Admin (Full organization controls)</option>
                  <option value="Manager">Manager (Billing updates & automations configuration)</option>
                  <option value="Support Agent">Support Agent (Respond to inbox & log notes only)</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-secondary-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button type="submit" className="modal-primary-btn">Send Invite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
