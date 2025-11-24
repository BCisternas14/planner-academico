// src/components/dashboard/DashboardClient.js
"use client";
import { useTasks } from "../../context/TaskContext";
import { signOut } from "next-auth/react"; 
import ProductivityStats from "./ProductivityStats";
import UpcomingTasks from "./UpcomingTasks";
import Workload from "./Workload";
import Notifications from "./Notifications";
import Goals from "./Goals";
//import GradeAverage from "./GradeAverage";

export default function DashboardClient({ session }) {
  const { tasks, totalTasks, totalCompletedTasks } = useTasks();

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
        {/* Usamos el nombre de la sesión, no "Benjamin" fijo */}
        <h1 className="dashboard-header">Hola, {session.user.name}.</h1> 
        
        {/* Botón de Cerrar Sesión (estilo adaptado a tus variables CSS) */}
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '8px 15px', 
            // Color de énfasis usando una variable que destaque para logout
            backgroundColor: '#d9534f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', // Coherente con otros elementos de tu UI
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
        <Goals goal={productivityGoal} currentProgress={totalCompletedTasks} />
      </div>
    </div>
  );
}