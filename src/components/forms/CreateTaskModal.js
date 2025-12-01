// src/components/forms/CreateTaskModal.js
'use client'; 
import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext'; 

// ** MODIFICADO: Aceptar availableGoals como prop **
export default function CreateTaskModal({ availableGoals = [] }) { 
  const { showModal, closeModal, saveTask, taskToEdit } = useTasks();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('tarea');
  const [description, setDescription] = useState('');
  // ** NUEVO ESTADO: ID de la meta seleccionada **
  const [selectedGoalId, setSelectedGoalId] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDueDate(taskToEdit.dueDate);
      setCategory(taskToEdit.category);
      setDescription(taskToEdit.description || '');
      // ** NUEVO: Cargar la meta asociada si existe **
      // Asume que tu tarea de edición tiene un campo 'goalId'
      setSelectedGoalId(taskToEdit.goalId || ''); 
    } else {
      setTitle('');
      setDueDate('');
      setCategory('tarea');
      setDescription('');
      // ** NUEVO: Resetear el estado de la meta **
      setSelectedGoalId('');
    }
  }, [taskToEdit, showModal]); 

  if (!showModal) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ** MODIFICADO: Incluir el ID de la meta en los datos a guardar si es una tarea **
    const taskData = { 
      title, 
      dueDate, 
      category, 
      description,
      // Solo incluimos goalId si la categoría es 'tarea' y se seleccionó una meta
      ...(category === 'tarea' && selectedGoalId && { goalId: selectedGoalId }) 
    };
    
    // NOTA: Asegúrate de que tu función saveTask en TaskContext maneje el nuevo campo `goalId`.
    saveTask(taskData);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{taskToEdit ? 'Editar Tarea' : 'Crear'}</h2>
        <p className="subtitle">{taskToEdit ? 'Modifica los detalles de tu tarea.' : 'Organiza tus pendientes académicos'}</p>
        <button className="modal-close-button" onClick={closeModal}>
          <span className="material-icons">close</span>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="material-icons">title</span>
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="input-group">
            <span className="material-icons">calendar_today</span>
            <input type="date" placeholder="Fecha de entrega" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>
          <div className="input-group">
            <span className="material-icons">category</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="tarea">Actividad</option>
              <option value="meta">Meta</option>
            </select>
          </div>
          
          {/* ** NUEVO: Renderizado Condicional del Selector de Meta ** */}
          {category === 'tarea' && (
            <div className="input-group">
              <span className="material-icons">flag</span>
              <select 
                value={selectedGoalId} 
                onChange={e => setSelectedGoalId(e.target.value)}
              >
                <option value="">-- Elige la Meta asociada (obligatorio) --</option> 
                {availableGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* ** FIN: Renderizado Condicional ** */}

          <div className="input-group">
            <span className="material-icons">description</span>
            <input type="text" placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          <button type="submit" className="save-button">{taskToEdit ? 'Guardar Cambios' : 'Guardar'}</button>
          <a href="#" className="cancel-link" onClick={closeModal}>Cancelar</a>
        </form>
      </div>
    </div>
  );
}