// src/components/dashboard/DashboardClient.js
"use client";
import React, { useState, useEffect } from 'react'; // <--- NUEVO: Importar React Hooks
import { useTasks } from "../../context/TaskContext";
import { signOut } from "next-auth/react"; 
import ProductivityStats from "./ProductivityStats";
import UpcomingTasks from "./UpcomingTasks";
import Workload from "./Workload";
import Notifications from "./Notifications";
import Goals, { fetchGoals } from "./Goals"; // <--- MODIFICADO: Importar fetchGoals
import CreateTaskModal from '../forms/CreateTaskModal'; // <--- NUEVO: Importar el modal

//import GradeAverage from "./GradeAverage";

export default function DashboardClient({ session }) {
  // ** MODIFICADO: Añadir showModal del contexto **
  const { tasks, totalTasks, totalCompletedTasks, showModal } = useTasks(); 
  // ** NUEVO: Estado para almacenar las metas **
  const [availableGoals, setAvailableGoals] = useState([]); 

  // ** NUEVO: Cargar metas al montar el componente **
  useEffect(() => {
    const loadGoals = async () => {
        const goalsList = await fetchGoals();
        setAvailableGoals(goalsList);
    };
    loadGoals();
  }, []); // El array vacío asegura que se ejecute solo una vez al inicio

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); 
  };
  
  const notifications = [
    { id: 1, message: "Tienes una tarea pendiente para mañana." },
  ];
  const productivityGoal = 10;

  return (
    <div>
      {/* Contenedor para alinear el título y el botón de logout */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
      }}>
        <h1 className="dashboard-header">Hola, {session.user.name}.</h1> 
        
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#d9534f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.2s',
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-grid">
        <ProductivityStats completedTasks={totalCompletedTasks} totalTasks={totalTasks} />
        <UpcomingTasks tasks={tasks} />
        <Workload tasks={tasks} />
        <Notifications notifications={notifications} />
        <Goals /> 
        
      </div>
      
      {/* ** NUEVO: Renderizar el Modal y pasar las metas disponibles ** */}
      {showModal && (
        <CreateTaskModal availableGoals={availableGoals} /> 
      )}
    </div>
  );
}