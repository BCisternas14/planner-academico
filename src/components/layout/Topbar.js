'use client'; 
import { useTasks } from '../../context/TaskContext'; 

export default function Topbar() {
  const { openModal } = useTasks(); 
  return (
    <header className="topbar">
      <button className="add-task-button" onClick={openModal}>
        <span className="material-icons">add</span> Añadir
      </button>
    </header>
  );
}