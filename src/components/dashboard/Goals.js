// src/components/dashboard/Goals.js
import React from 'react';

// Datos de ejemplo
const goal = 10;
const currentProgress = 7;

export default function Goals() {
  const progressPercentage = Math.round((currentProgress / goal) * 100);

  return (
    <div className="dashboard-card">
      <h3>Mi Meta de Productividad</h3>
      <div className="goals-content">
        <div 
            className="goal-progress-ring" 
            style={{'--p': `${progressPercentage}%`}} 
            data-progress={`${progressPercentage}%`}
        ></div>
        <p className="goal-text">Llevas {currentProgress} de {goal} tareas semanales.</p>
      </div>
    </div>
  );
}