'use client';
import { useTasks } from '../../context/TaskContext';

export default function TasksPage() {
  const { tasks, toggleTaskCompleted, openEditModal, deleteTask } = useTasks();
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <div className="tasks-page-container">
      <h1 className="dashboard-header">Todas las Tareas</h1>
      
      <ul className="tasks-list">
        {sortedTasks.length === 0 ? (
          <li className="empty-state" style={{padding: '2rem'}}>
            <span className="material-icons empty-state-icon">check_circle</span>
            <p>No hay tareas pendientes. ¡Añade una!</p>
          </li>
        ) : (
          sortedTasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                className="task-item-checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompleted(task.id)}
              />
              <div className="task-item-info">
                <h4>{task.title}</h4>
                <div className="task-item-details">
                  <span>
                    <span className="material-icons">calendar_today</span>
                    {new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <span>
                    <span className="material-icons">category</span>
                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  </span>
                </div>
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
          ))
        )}
      </ul>
    </div>
  );
}