'use client'; 
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTasks } from '../../context/TaskContext'; 
import { createGoal, createActivity, fetchUserGoals } from '@/actions/goalActions';

export default function CreateTaskModal({ availableGoals = [] }) { 
  const { data: session } = useSession(); 
  const router = useRouter();
  // AGREGADO: Recuperamos 'saveTask' del contexto para actualizar la UI visualmente
  const { showModal, closeModal, taskToEdit, saveTask } = useTasks();
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('tarea'); 
  const [description, setDescription] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado de metas
  const [goals, setGoals] = useState(availableGoals);

  // --- CARGA DE METAS AUTOMÁTICA ---
  useEffect(() => {
    async function loadUserGoals() {
      if (showModal && session?.user?.id) {
        try {
          const fetchedGoals = await fetchUserGoals(session.user.id);
          if (fetchedGoals && Array.isArray(fetchedGoals)) {
            setGoals(fetchedGoals);
          }
        } catch (error) {
          console.error("🔴 MODAL: Error cargando metas:", error);
        }
      }
    }
    loadUserGoals();
  }, [showModal, session]); 

  // --- RESTAURAR ESTADO AL ABRIR/EDITAR ---
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDueDate(taskToEdit.dueDate || '');
      setCategory(taskToEdit.category || 'tarea');
      setDescription(taskToEdit.description || '');
      setSelectedGoalId(taskToEdit.goalId || ''); 
    } else {
      setTitle('');
      setDueDate('');
      setCategory('tarea'); 
      setDescription('');
      setSelectedGoalId('');
    }
  }, [taskToEdit, showModal]); 

  if (!showModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('titulo', title);
    formData.append('descripcion', description);
    
    let result;

    try {
      if (category === 'meta') {
        // --- CREAR META ---
        formData.append('fecha_limite', dueDate);
        if (!session?.user?.id) throw new Error("Debes iniciar sesión.");
        
        result = await createGoal(session.user.id, formData);

      } else {
        // --- CREAR ACTIVIDAD ---
        if (!selectedGoalId) throw new Error("Debes seleccionar una meta asociada.");
        formData.append('meta_id', selectedGoalId);
        
        // Esta función ahora sí existe gracias al archivo goalActions.js actualizado
        result = await createActivity(formData);
      }

      if (result.success) {
        // 1. ACTUALIZAR UI LOCAL (Lo que pediste: que salga en el apartado de tareas)
        // Usamos saveTask para agregar el item al contexto visual
        if (saveTask && typeof saveTask === 'function') {
          saveTask({
            id: result.data.id, // Usamos el ID real de la base de datos
            title: title,
            description: description,
            dueDate: dueDate,
            category: category, // 'meta' o 'tarea'
            goalId: selectedGoalId // Si es tarea, vinculamos la meta
          });
        }

        alert("¡Creado con éxito!");
        closeModal();
        router.refresh(); 
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{taskToEdit ? 'Editar' : `Crear ${category === 'meta' ? 'Meta' : 'Actividad'}`}</h2>
        
        <button className="modal-close-button" onClick={closeModal}>
          <span className="material-icons">close</span>
        </button>

        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div className="input-group">
            <span className="material-icons">title</span>
            <input 
              type="text" 
              placeholder="Título" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Tipo */}
          <div className="input-group">
            <span className="material-icons">category</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="tarea">Actividad</option>
              <option value="meta">Meta</option>
            </select>
          </div>
          
          {/* Selector de Metas (SOLO PARA ACTIVIDADES) */}
          {category === 'tarea' && (
            <div className="input-group">
              <span className="material-icons">flag</span>
              <select 
                value={selectedGoalId} 
                onChange={e => setSelectedGoalId(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="">-- Selecciona la Meta --</option> 
                {goals.length > 0 ? (
                  goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.titulo || goal.Titulo || goal.title || "Meta sin nombre"} 
                    </option>
                  ))
                ) : (
                  <option disabled>No se encontraron metas</option>
                )}
              </select>
            </div>
          )}

          {/* Fecha (Solo obligatoria para Meta) */}
          <div className="input-group">
            <span className="material-icons">calendar_today</span>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              required={category === 'meta'} 
            />
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 500px; position: relative; }
        .input-group { display: flex; align-items: center; margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 8px; }
        .input-group input, .input-group select { border: none; outline: none; width: 100%; margin-left: 10px; font-size: 16px; }
        .modal-close-button { position: absolute; top: 15px; right: 15px; border: none; background: none; cursor: pointer; }
        .save-button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 10px; }
      `}</style>
    </div>
  );
}