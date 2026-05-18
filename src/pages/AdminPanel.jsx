import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { ShieldCheck, HardDrive, Cpu, Terminal, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const { systemStats } = useContext(AppContext);

  return (
    <div className="admin-panel-page animate-fade-in">
      <Header title="Super Admin Control" />

      {/* Admin stats */}
      <section className="admin-kpi-row">
        <div className="admin-summary-card glass-panel">
          <div className="admin-card-header">
            <Cpu size={18} className="glow-brand-icon" />
            <span>AI Token Engine Usage</span>
          </div>
          <div className="admin-card-val">{systemStats.tokensUsed.toLocaleString()}</div>
          <p className="admin-card-sub text-green">Cost: ${(systemStats.tokensUsed * 0.00001).toFixed(2)} USD</p>
        </div>

        <div className="admin-summary-card glass-panel">
          <div className="admin-card-header">
            <RefreshCw size={18} className="glow-brand-icon" />
            <span>API Synchronizations Executed</span>
          </div>
          <div className="admin-card-val">{systemStats.apiCalls.toLocaleString()}</div>
          <p className="admin-card-sub">Success Rate: 100%</p>
        </div>

        <div className="admin-summary-card glass-panel">
          <div className="admin-card-header">
            <HardDrive size={18} className="glow-brand-icon" />
            <span>Automated Replies Dispatched</span>
          </div>
          <div className="admin-card-val">{systemStats.autoRepliesPosted}</div>
          <p className="admin-card-sub text-green">Automation Rate: 92%</p>
        </div>
      </section>

      {/* Tenancy lists & System logs */}
      <div className="admin-tables-grid">
        
        {/* Table A: Tenants List */}
        <div className="admin-table-card glass-panel col-span-2">
          <div className="admin-card-header-with-actions">
            <h3>Registered Organization Tenants</h3>
            <p>Active multi-tenant database clusters</p>
          </div>

          <div className="admin-table-wrapper">
            <table className="custom-dashboard-table">
              <thead>
                <tr>
                  <th>Workspace Brand</th>
                  <th>Owner Admin</th>
                  <th>Subscription Tier</th>
                  <th>Locations Linked</th>
                  <th>AI Token Allocation</th>
                  <th>Billing Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Main Street Brand Cafes</strong></td>
                  <td>James Carter</td>
                  <td><span className="p-badge status-assigned">Growth Pro</span></td>
                  <td>4 locations</td>
                  <td>142.8K / 3.0M</td>
                  <td><span className="status-teammate-pill stat-active">Active</span></td>
                </tr>
                <tr>
                  <td><strong>Hudson River Diners Inc.</strong></td>
                  <td>William Miller</td>
                  <td><span className="p-badge status-unanswered">Starter Free</span></td>
                  <td>1 location</td>
                  <td>4.2K / 10.0K</td>
                  <td><span className="status-teammate-pill stat-active">Active</span></td>
                </tr>
                <tr>
                  <td><strong>Aero-Tech Computing</strong></td>
                  <td>Lucas Stark</td>
                  <td><span className="p-badge status-posted">Enterprise VIP</span></td>
                  <td>28 locations</td>
                  <td>1.8M / 10.0M</td>
                  <td><span className="status-teammate-pill stat-active">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table B: System Logs */}
        <div className="admin-table-card glass-panel col-span-2">
          <div className="admin-card-header-with-actions">
            <div className="flex-row-header">
              <Terminal size={18} className="glow-brand-icon" style={{ marginRight: '6px' }} />
              <h3>Platform Transactional Audit Logs</h3>
            </div>
            <p>Security logging of all administrative actions inside client workspaces</p>
          </div>

          <div className="audit-logs-terminal-stream">
            {systemStats.auditLogs.map(log => (
              <div key={log.id} className="audit-log-line">
                <span className="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="log-action">{log.action}</span>
                <span className="log-user">({log.user})</span>
                <span className="log-dash">-</span>
                <span className="log-details">{log.details}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
