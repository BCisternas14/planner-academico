// src/app/layout.js
'use client'; 
import React from 'react';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CreateTaskModal from '../components/forms/CreateTaskModal';
import { TaskProvider } from '../context/TaskContext'; 
import NextAuthProvider from '../components/NextAuthProvider'; 
import { usePathname } from 'next/navigation'; // <-- CRÍTICO

// Componente Cliente para aplicar la estructura del Dashboard
const DashboardShell = ({ children }) => {
  const pathname = usePathname();
  // La condición para NO aplicar el layout es si la ruta comienza con /login
  const isLoginPage = pathname.startsWith('/login'); 
  
  if (isLoginPage) {
    // Si es la página de login, solo mostramos el formulario centrado
    return <>{children}</>;
  }

  // Para el Dashboard y todas sus sub-páginas (/tareas, /calendario, etc.)
  return (
    // ¡Esta es la estructura completa de tu Dashboard, usando tus clases CSS!
    <div className="app-container"> 
      <Sidebar />
      <div className="main-content">
        <Topbar /> 
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* CRÍTICO: NextAuthProvider debe envolver a toda la aplicación */}
        <NextAuthProvider> 
          <TaskProvider>
            
            <DashboardShell>
              {children}
            </DashboardShell>
            
            <CreateTaskModal />
          </TaskProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}