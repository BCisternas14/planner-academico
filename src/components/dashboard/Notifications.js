import React from 'react';
import Link from 'next/link';

// Datos de ejemplo
const notifications = [

];

export default function Notifications() {
  return (
    <div className="dashboard-card yellow-bg">
      <h3>Notificaciones</h3>
      
      {notifications.length > 0 ? (
        <>
          <ul className="notification-list">
            {notifications.map(notification => (
              <li key={notification.id}>
                <span className="material-icons">info</span>
                <span>{notification.message}</span>
              </li>
            ))}
          </ul>
          <div className="dashboard-card-footer" style={{ borderTopColor: 'var(--card-border-yellow)' }}>
             <Link href="/notifications">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon" style={{color: 'var(--card-border-yellow)'}}>notifications_none</span>
          <p>Sin notificaciones nuevas.</p>
        </div>
      )}
    </div>
  );
}