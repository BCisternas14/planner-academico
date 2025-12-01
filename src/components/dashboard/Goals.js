// src/components/dashboard/Goals.js
import React from 'react';

// Datos de ejemplo para el componente de visualización
const goal = 10;
const currentProgress = 7;

// ** NUEVO: Datos de ejemplo de metas disponibles para el modal **
const MOCK_AVAILABLE_GOALS = [
    { id: 'g1', title: 'Aprobar Cálculo I' },
    { id: 'g2', title: 'Terminar el proyecto final de Web' },
    { id: 'g3', title: 'Preparar el examen de Física' },
];

// ** NUEVO: Función para simular la carga de metas **
// Reemplaza esto con tu llamada real a la API/DB (e.g., fetch, Server Action)
export async function fetchGoals() {
    // Aquí iría tu lógica de conexión a la base de datos
    // Por ahora, devolvemos los datos mock
    return MOCK_AVAILABLE_GOALS;
}

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