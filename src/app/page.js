// src/app/page.js
'use client'; 
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 

import DashboardClient from '../components/dashboard/DashboardClient'; 
// Asegúrate de NO importar Sidebar o Topbar aquí.

export default function DashboardPage() {
  
  const router = useRouter(); 
  const { data: session, status } = useSession(); 

  
  // LÓGICA DE REDIRECCIÓN A /login
  useEffect(() => {
    // Redirigir si ya terminó de cargar la sesión Y no hay usuario
    if (status !== 'loading' && !session) {
      router.push('/login'); 
    }
  }, [session, status, router]); 

  
  if (status === 'loading') {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--secondary-bg)'}}>Cargando sesión...</div> 
  }

  if (!session) {
    return null; // El useEffect se encarga de la redirección
  }

  // Si hay sesión, el layout.js se encarga de envolver esto con Sidebar y Topbar
  return (
    <DashboardClient session={session} />
  );
}