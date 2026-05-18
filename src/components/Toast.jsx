import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let className = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          className = 'toast-success';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          className = 'toast-warning';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          className = 'toast-error';
        }

        return (
          <div key={toast.id} className={`toast-card ${className}`}>
            <div className="toast-icon-wrapper">
              <Icon size={20} />
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
