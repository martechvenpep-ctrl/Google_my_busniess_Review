import React from 'react';

export default function DataDeletion() {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        maxWidth: '600px',
        width: '90%',
        border: '1px solid #334155'
      }}>
        <h1 style={{
          marginTop: '0',
          fontSize: '24px',
          fontWeight: '600',
          color: '#38bdf8',
          marginBottom: '24px'
        }}>Data Deletion Instructions</h1>
        
        <p style={{
          lineHeight: '1.6',
          color: '#94a3b8',
          marginBottom: '16px'
        }}>If you would like to delete your data associated with our application, please follow one of the methods below:</p>
        
        <div style={{
          backgroundColor: '#0f172a',
          padding: '24px',
          borderRadius: '12px',
          margin: '20px 0',
          borderLeft: '4px solid #38bdf8'
        }}>
          <strong style={{
            color: '#e2e8f0',
            display: 'block',
            marginBottom: '8px',
            fontSize: '18px'
          }}>Option 1: Contact Support</strong>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            Send an email to <a href="mailto:support@yourdomain.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>support@yourdomain.com</a> with your Facebook account details. We will delete all associated data within 7 business days.
          </p>
        </div>

        <div style={{
          backgroundColor: '#0f172a',
          padding: '24px',
          borderRadius: '12px',
          margin: '20px 0',
          borderLeft: '4px solid #38bdf8'
        }}>
          <strong style={{
            color: '#e2e8f0',
            display: 'block',
            marginBottom: '8px',
            fontSize: '18px'
          }}>Option 2: Remove App Access Directly</strong>
          <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
            You may also remove app access directly from your Facebook account settings by visiting the following link:
          </p>
          <p style={{ margin: 0 }}>
            <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', wordBreak: 'break-all' }}>
              https://www.facebook.com/settings?tab=applications
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
