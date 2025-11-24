import React from 'react';

export default function Workload({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-card green-bg">
      <h3>Carga de Trabajo</h3>
      <div className="workload-content">
        <span className="workload-value">{pendingTasks}</span>
        <p className="workload-description">tareas pendientes</p>
        <div className="workload-progress-bar-container">
            <div 
                className="workload-progress-bar-fill" 
                style={{ width: `${completionPercentage}%` }}
            ></div>
        </div>
        <p className="stats-detail-text" style={{color: 'inherit'}}>Completadas: {completedTasks} de {totalTasks} tareas</p>
      </div>
    </div>
  );
}