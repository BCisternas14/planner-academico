'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
// Importamos ambas funciones de búsqueda
import { fetchUserActivities, fetchUserGoals } from '@/actions/goalActions'; 

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { data: session } = useSession(); 
  const [tasks, setTasks] = useState([]); 
  
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // --- CARGA UNIFICADA: METAS + ACTIVIDADES ---
  useEffect(() => {
    async function loadAllData() {
      if (session?.user?.id) {
        console.log("📥 Contexto: Cargando metas y actividades...");
        try {
          // 1. Ejecutamos ambas peticiones en paralelo
          const [dbActivities, dbGoals] = await Promise.all([
            fetchUserActivities(session.user.id),
            fetchUserGoals(session.user.id)
          ]);
          
          // 2. Procesamos las ACTIVIDADES (Prefijo 'act-')
          const formattedActivities = (dbActivities || []).map(act => ({
            ...act,
            id: `act-${act.id}`, // Prefijo para evitar IDs duplicados
            originalId: act.id,  // Guardamos ID real por si acaso
            category: 'tarea',
            dueDate: act.dueDate || new Date().toISOString()
          }));

          // 3. Procesamos las METAS (Prefijo 'goal-')
          // Adaptamos los campos de la DB (titulo -> title) para que TaskList los entienda
          const formattedGoals = (dbGoals || []).map(goal => ({
            id: `goal-${goal.id}`,
            originalId: goal.id,
            title: goal.titulo,          // Mapeo clave
            description: goal.descripcion,
            completed: goal.completada,
            dueDate: goal.fecha_limite || new Date().toISOString(),
            category: 'meta'             // Categoría clave para el filtro visual
          }));

          // 4. Combinamos todo en una sola lista maestra
          setTasks([...formattedGoals, ...formattedActivities]); 

        } catch (error) {
          console.error("Error cargando datos:", error);
          setTasks([]); 
        }
      }
    }
    loadAllData();
  }, [session]); 

  // --- GESTIÓN DE ESTADO ---

  const saveTask = (newItemData) => {
    // Determinamos el prefijo según la categoría que viene del Modal
    const prefix = newItemData.category === 'meta' ? 'goal-' : 'act-';
    
    // Aseguramos que el ID tenga el formato correcto
    const itemToSave = {
      ...newItemData,
      id: newItemData.id.toString().startsWith(prefix) ? newItemData.id : `${prefix}${newItemData.id}`,
      dueDate: newItemData.dueDate || new Date().toISOString()
    };

    if (tasks.some(t => t.id === itemToSave.id)) {
      setTasks(prev => prev.map(t => t.id === itemToSave.id ? { ...t, ...itemToSave } : t));
    } else {
      setTasks(prev => [itemToSave, ...prev]);
    }
    closeModal();
  };

  const deleteTask = (taskId) => {
    // Filtramos localmente (el prefijo ya viene en taskId)
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompleted = (taskId) => {
    // OPCIONAL: Si es una meta, impedimos que se marque aquí (doble seguridad)
    if (typeof taskId === 'string' && taskId.startsWith('goal-')) {
      return; 
    }

    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const openModal = () => { setTaskToEdit(null); setShowModal(true); };
  const openEditModal = (task) => { 
    // Al editar, si tiene prefijo, podríamos querer limpiarlo o manejarlo en el modal
    // Por ahora pasamos la tarea tal cual, el modal debe manejar los datos visuales
    setTaskToEdit(task); 
    setShowModal(true); 
  };
  const closeModal = () => { setShowModal(false); setTaskToEdit(null); };

  return (
    <TaskContext.Provider value={{
      tasks,
      saveTask,
      deleteTask,
      toggleTaskCompleted,
      showModal,
      openModal,
      openEditModal,
      closeModal,
      taskToEdit
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);