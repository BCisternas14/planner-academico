'use client';
import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../context/TaskContext'; 

export default function Notifications() {
  const { tasks } = useTasks(); 

  const urgentMetas = tasks
    .filter(t => t.category === 'meta' && !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) 
    .slice(0, 3); 

  return (
    <div className="dashboard-card yellow-bg">
      <h3>Recordatorios de Metas</h3>
      
      {urgentMetas.length > 0 ? (
        <>
          <ul className="notification-list">
            {urgentMetas.map(meta => (
              <li key={meta.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="material-icons" style={{ fontSize: '18px', color: '#b7791f' }}>warning</span>
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>
                      {meta.title}
                    </span>
                    <span style={{ fontSize: '12px', color: '#744210' }}>
                      {/* --- CORRECCIÓN DE FECHA --- */}
                      Vence el {new Date(meta.dueDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="dashboard-card-footer" style={{ borderTopColor: 'var(--card-border-yellow)' }}>
             <Link href="/tasks">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon" style={{color: 'var(--card-border-yellow)'}}>notifications_none</span>
          <p>¡Sin metas urgentes pendientes!</p>
        </div>
      )}
      
      <style jsx>{`
        .yellow-bg { background-color: #fffbeb; border: 1px solid #fcd34d; }
        .notification-list { list-style: none; padding: 0; margin: 0; }
      `}</style>
    </div>
  );
}