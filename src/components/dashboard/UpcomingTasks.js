'use client';
import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../context/TaskContext'; 

export default function UpcomingTasks() {
  const { tasks } = useTasks();

  const upcoming = tasks
    .filter(task => !task.completed && task.dueDate && new Date(task.dueDate) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <div className="dashboard-card event-list"> 
      <h3>Próximas Entregas</h3>
      {upcoming.length > 0 ? (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {upcoming.map(task => {
              const isMeta = task.category === 'meta';
              
              return (
                <li key={task.id} className="upcoming-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <div className="upcoming-content">
                    <div className="upcoming-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '500', color: '#333' }}>{task.title}</span>
                      
                      {isMeta ? (
                        <span style={{ fontSize: '9px', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>META</span>
                      ) : (
                        <span style={{ fontSize: '9px', backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 5px', borderRadius: '3px', fontWeight: 'bold' }}>ACTIVIDAD</span>
                      )}
                    </div>

                    {!isMeta && task.goalTitle && (
                      <div style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons" style={{ fontSize: '10px' }}>flag</span>
                        {task.goalTitle}
                      </div>
                    )}
                  </div>

                  <span className="event-date" style={{ fontSize: '12px', color: '#666', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>
                    {/* --- CORRECCIÓN DE FECHA --- */}
                    {new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="dashboard-card-footer">
            <Link href="/calendar">Ver calendario</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon">event_available</span>
          <p>¡Nada pendiente a la vista! 🎉</p>
          <div className="dashboard-card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
             <Link href="/calendar">Ir al calendario</Link>
          </div>
        </div>
      )}
    </div>
  );
}