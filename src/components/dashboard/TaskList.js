'use client'; 
import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../context/TaskContext';

export default function TaskList() {
  const { tasks, toggleTaskCompleted, openEditModal, deleteTask } = useTasks();

  // Filtra solo tareas pendientes para "Tareas para hoy"
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="dashboard-card task-list">
      <h3>Tarea para hoy</h3>
      
      {pendingTasks.length > 0 ? (
        <>
          <ul>
            {pendingTasks.slice(0, 3).map(task => ( // Muestra solo las 3 primeras
              <li key={task.id} className="task-item">
                <input 
                  type="checkbox" 
                  className="task-item-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id)} 
                />
                <div className="task-item-info">
                  <h4>{task.title}</h4>
                </div>
                
                {}
                <div className="task-item-actions">
                  <button 
                    className="task-action-button edit" 
                    onClick={() => openEditModal(task)} // T4.6
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button 
                    className="task-action-button delete" 
                    onClick={() => deleteTask(task.id)} // T4.5
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="dashboard-card-footer">
            {}
            <Link href="/tasks">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon">check_circle</span>
          <p>¡Todo listo por hoy!</p>
        </div>
      )}
    </div>
  );
}