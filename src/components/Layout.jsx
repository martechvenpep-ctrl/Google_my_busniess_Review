import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Cpu, 
  Brain, 
  Boxes, 
  Users, 
  CreditCard, 
  Bell, 
  Settings2, 
  Code2, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Layout({ children }) {
  const { activePage, setActivePage, theme, billing, user } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reviews', label: 'Reviews Inbox', icon: Inbox, badge: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'automations', label: 'Automations', icon: Cpu },
    { id: 'brand-settings', label: 'AI Brand Training', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Boxes },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'billing', label: 'SaaS Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'admin-panel', label: 'Admin Panel', icon: Settings2, adminOnly: true },
    { id: 'api-docs', label: 'API Developer', icon: Code2 }
  ];

  return (
    <div className="app-container">
      {/* Mobile Sidebar Toggle Header */}
      <div className="mobile-header">
        <div className="brand-logo-mobile">
          <Sparkles className="logo-sparkle" size={22} />
          <span>AI ReviewPilot</span>
        </div>
        <button className="mobile-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Frame */}
      <aside className={`sidebar-frame ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-wrapper">
          <div className="logo-glow-orb"></div>
          <Sparkles className="brand-logo-icon" size={24} />
          <span className="brand-logo-text">AI ReviewPilot</span>
          <span className="brand-version-badge">v1.2</span>
        </div>

        {/* User Card inside Sidebar */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">JC</div>
          <div className="user-info-text">
            <h4>James Carter</h4>
            <p>Super Admin</p>
          </div>
          <div className="user-plan-tag">{billing.plan}</div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Operations</div>
          {menuItems.slice(0, 3).map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-indicator-chevron" />}
              </button>
            );
          })}

          <div className="nav-section-title">AI & Automations</div>
          {menuItems.slice(3, 5).map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-indicator-chevron" />}
              </button>
            );
          })}

          <div className="nav-section-title">Settings & SaaS</div>
          {menuItems.slice(5, 9).map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-indicator-chevron" />}
              </button>
            );
          })}

          <div className="nav-section-title">Developers & System</div>
          {menuItems.slice(9).map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''} ${item.adminOnly ? 'admin-item' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                {item.adminOnly ? <ShieldCheck size={18} className="shield-admin-icon" /> : <Icon size={18} />}
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-indicator-chevron" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Area with quick simulated logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => setActivePage('login')}>
            <LogOut size={16} />
            <span>Simulate Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Display Frame */}
      <main className="main-content-panel">
        {/* Render Page Children */}
        {children}
      </main>
    </div>
  );
}
