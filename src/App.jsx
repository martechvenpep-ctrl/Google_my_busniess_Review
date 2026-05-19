import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Layout from './components/Layout';
import Toast from './components/Toast';

// Subpages
import Dashboard from './pages/Dashboard';
import ReviewsInbox from './pages/ReviewsInbox';
import Analytics from './pages/Analytics';
import Automations from './pages/Automations';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import Team from './pages/Team';
import Billing from './pages/Billing';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import APIDocs from './pages/APIDocs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DataDeletion from './pages/DataDeletion';

import './index.css';

function AppContent() {
  const { activePage, toasts } = useContext(AppContext);

  // Check static page routes
  const path = window.location.pathname;
  if (path === '/data-deletion.html' || path === '/data-deletion' || path === '/facebook-data-deletion') {
    return <DataDeletion />;
  }

  // Auth pages render directly (no sidebar layout)
  if (activePage === 'login') {
    return (
      <>
        <Login />
        <Toast toasts={toasts} />
      </>
    );
  }

  if (activePage === 'signup') {
    return (
      <>
        <Signup />
        <Toast toasts={toasts} />
      </>
    );
  }

  // Define layout wrapper page rendering
  return (
    <Layout>
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'reviews' && <ReviewsInbox />}
      {activePage === 'analytics' && <Analytics />}
      {activePage === 'automations' && <Automations />}
      {activePage === 'brand-settings' && <Settings />}
      {activePage === 'integrations' && <Integrations />}
      {activePage === 'team' && <Team />}
      {activePage === 'billing' && <Billing />}
      {activePage === 'notifications' && <Notifications />}
      {activePage === 'admin-panel' && <AdminPanel />}
      {activePage === 'api-docs' && <APIDocs />}
      
      {/* Toast Alert notifications */}
      <Toast toasts={toasts} />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
