'use client';
import React from 'react';
import { useTasks } from '../../context/TaskContext'; // Conectamos al contexto

export default function ProductivityStats() {
  const { tasks } = useTasks();

  // Filtramos solo ACTIVIDADES (tareas) para medir la productividad diaria/semanal
  // (Las metas son a largo plazo, así que no las contamos aquí para no sesgar el %)
  const activities = tasks.filter(t => t.category !== 'meta');
  
  const total = activities.length;
  const completed = activities.filter(t => t.completed).length;
  
  // Cálculo de porcentaje seguro (evita división por cero)
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="dashboard-card blue-bg">
      <h3>Productividad (Actividades)</h3>
      <div className="stats-card-content">
        <span className="stats-main-value" style={{color: 'var(--card-text-blue)'}}>
          {percentage}%
        </span>
        <p className="stats-description">de avance total</p>
        
        {/* Barra de progreso */}
        <div className="workload-progress-bar-container" style={{
          width: '100%', 
          height: '8px', 
          backgroundColor: 'rgba(255,255,255,0.5)', 
          borderRadius: '10px', 
          margin: '15px 0', 
          overflow: 'hidden'
        }}>
            <div 
                className="workload-progress-bar-fill" 
                style={{ 
                  width: `${percentage}%`, 
                  height: '100%',
                  backgroundColor: '#2563eb', // Azul fuerte
                  transition: 'width 0.5s ease'
                }}
            ></div>
        </div>
        
        <p className="stats-detail-text" style={{ fontSize: '13px', opacity: 0.9 }}>
          {completed} de {total} actividades completadas
        </p>
      </div>

      <style jsx>{`
        .blue-bg { background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; }
        .stats-card-content { text-align: center; padding: 10px; }
        .stats-main-value { font-size: 3rem; font-weight: bold; display: block; line-height: 1; }
      `}</style>
    </div>
  );
}