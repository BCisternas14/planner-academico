'use client'; 
import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../context/TaskContext';

export default function TaskList() {
  const { tasks, toggleTaskCompleted, openEditModal, deleteTask } = useTasks();

  // Filtramos pendientes. Las metas siempre aparecen si no están completadas.
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="dashboard-card task-list">
      <h3>Agenda del Día</h3>
      
      {pendingTasks.length > 0 ? (
        <>
          <ul>
            {pendingTasks.slice(0, 5).map(task => {
              // Detectamos si es meta para aplicar lógica especial
              const isMeta = task.category === 'meta';

              return (
                <li key={task.id} className={`task-item ${isMeta ? 'is-meta' : ''}`}>
                  <input 
                    type="checkbox" 
                    className="task-item-checkbox"
                    checked={task.completed}
                    onChange={() => !isMeta && toggleTaskCompleted(task.id)} 
                    // BLOQUEO: Si es meta, desactivamos el checkbox
                    disabled={isMeta}
                    style={isMeta ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  />
                  
                  <div className="task-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4>{task.title}</h4>
                      {/* ETIQUETA VISUAL: Solo para metas */}
                      {isMeta && (
                        <span style={{
                          fontSize: '10px',
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          Meta
                        </span>
                      )}
                    </div>
                    {/* Opcional: Mostrar fecha si es relevante */}
                    {task.dueDate && (
                      <small style={{ color: '#888', fontSize: '11px' }}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                  
                  <div className="task-item-actions">
                    <button 
                      className="task-action-button edit" 
                      onClick={() => openEditModal(task)}
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    {/* Solo permitimos borrar tareas normales desde aquí por seguridad, o ambas si prefieres */}
                    <button 
                      className="task-action-button delete" 
                      onClick={() => deleteTask(task.id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="dashboard-card-footer">
            <Link href="/tasks">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon">check_circle</span>
          <p>¡Todo al día!</p>
        </div>
      )}

      {/* Estilos inline extra para diferenciar la meta visualmente */}
      <style jsx>{`
        .is-meta {
          background-color: #fafafa; /* Fondo sutilmente distinto */
        }
      `}</style>
    </div>
  );
}