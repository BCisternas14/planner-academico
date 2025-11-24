'use client';
import React, { createContext, useContext, useState } from 'react';

const mockTasks = [
  { id: 1, title: 'Estudiar Matemáticas', dueDate: '2025-10-19', category: 'estudio', description: 'Repasar derivadas', completed: false },
  { id: 2, title: 'Entregar Proyecto', dueDate: '2025-10-21', category: 'tarea', description: 'Subir a GitHub', completed: false },
  { id: 3, title: 'Revisar avance de Taller', dueDate: '2025-10-18', category: 'tarea', description: '', completed: true },
  { id: 4, title: 'Estudiar PP2 de Calculo', dueDate: '2025-10-25', category: 'estudio', description: '', completed: true },
];

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(mockTasks);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); 

  const openModal = () => setShowModal(true);
  
  const closeModal = () => {
    setShowModal(false);
    setTaskToEdit(null); 
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const deleteTask = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const saveTask = (taskData) => {
    if (taskToEdit) {
      setTasks(tasks.map(task => 
        task.id === taskToEdit.id ? { ...task, ...taskData } : task
      ));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
    closeModal();
  };
  
  const toggleTaskCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const value = {
    tasks,
    showModal,
    taskToEdit,
    openModal,
    closeModal,
    openEditModal,
    deleteTask,
    saveTask,
    toggleTaskCompleted,
    totalTasks: tasks.length,
    totalCompletedTasks: tasks.filter(task => task.completed).length,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};