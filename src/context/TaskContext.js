'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import { fetchUserActivities, fetchUserGoals, deleteGoal, deleteActivity } from '@/actions/goalActions'; 

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { data: session } = useSession(); 
  const [tasks, setTasks] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    async function loadAllData() {
      if (session?.user?.id) {
        try {
          const [dbActivities, dbGoals] = await Promise.all([
            fetchUserActivities(session.user.id),
            fetchUserGoals(session.user.id)
          ]);
          const goalsMap = new Map((dbGoals || []).map(g => [g.id, g.titulo]));
          
          const formattedActivities = (dbActivities || []).map(act => ({
            ...act,
            id: `act-${act.id}`, 
            originalId: act.id,  
            category: 'tarea',
            dueDate: act.dueDate || new Date().toISOString(),
            goalTitle: goalsMap.get(act.meta_id) || null,
            meta_id: act.meta_id // Aseguramos que este campo esté para poder filtrar al borrar
          }));

          const formattedGoals = (dbGoals || []).map(goal => ({
            id: `goal-${goal.id}`,
            originalId: goal.id,
            title: goal.titulo,          
            description: goal.descripcion,
            completed: goal.completada,
            dueDate: goal.fecha_limite || new Date().toISOString(),
            category: 'meta'             
          }));

          setTasks([...formattedGoals, ...formattedActivities]); 
        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      }
    }
    loadAllData();
  }, [session]); 

  // --- GUARDAR ---
  const saveTask = (newItemData) => {
    const prefix = newItemData.category === 'meta' ? 'goal-' : 'act-';
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

  // --- ELIMINAR INTELIGENTE (ESTA ES LA PARTE IMPORTANTE) ---
  const deleteTask = async (taskId) => {
    // 1. Identificar tipo y ID real
    const isGoal = taskId.toString().startsWith('goal-');
    const realId = taskId.split('-')[1];

    try {
      let result;
      if (isGoal) {
        result = await deleteGoal(realId);
      } else {
        result = await deleteActivity(realId);
      }

      if (result.success) {
        // 2. ACTUALIZAR ESTADO VISUAL
        if (isGoal) {
            // Si borramos una meta, borramos la meta Y sus hijos
            setTasks(prev => prev.filter(t => {
                // Borrar si es la meta misma
                if (t.id === taskId) return false;
                
                // Borrar si es una actividad vinculada a esa meta
                // Comparamos el meta_id de la actividad con el realId de la meta borrada
                if (t.meta_id && t.meta_id.toString() === realId.toString()) return false;

                return true; // Conservar el resto
            }));
        } else {
            // Si es solo una actividad, borramos solo esa
            setTasks(prev => prev.filter(task => task.id !== taskId));
        }
      } else {
        alert("Error al borrar: " + result.error);
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // --- COMPLETAR TAREA ---
  const toggleTaskCompleted = (taskId) => {
    if (typeof taskId === 'string' && taskId.startsWith('goal-')) return; 
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const openModal = () => { setTaskToEdit(null); setShowModal(true); };
  const openEditModal = (task) => { setTaskToEdit(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTaskToEdit(null); };

  return (
    <TaskContext.Provider value={{
      tasks, saveTask, deleteTask, toggleTaskCompleted,
      showModal, openModal, openEditModal, closeModal, taskToEdit
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);