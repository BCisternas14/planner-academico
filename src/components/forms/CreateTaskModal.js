'use client'; 
import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext'; 

export default function CreateTaskModal() {
  const { showModal, closeModal, saveTask, taskToEdit } = useTasks();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('tarea');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDueDate(taskToEdit.dueDate);
      setCategory(taskToEdit.category);
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setDueDate('');
      setCategory('tarea');
      setDescription('');
    }
  }, [taskToEdit, showModal]); 

  if (!showModal) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTask({ title, dueDate, category, description });
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{taskToEdit ? 'Editar Tarea' : 'Crear nueva Actividad'}</h2>
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
              <option value="tarea">Tarea</option>
              <option value="meta">Meta</option>
            </select>
          </div>
          <div className="input-group">
            <span className="material-icons">description</span>
            <input type="text" placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <button type="submit" className="save-button">{taskToEdit ? 'Guardar Cambios' : 'Guarar tarea'}</button>
          <a href="#" className="cancel-link" onClick={closeModal}>Cancelar</a>
        </form>
      </div>
    </div>
  );
}