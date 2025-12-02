// src/app/calendar/page.js
"use client";
// MODIFICADO: Añadido useEffect
import React, { useState, useEffect } from 'react'; 
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 

// ** NUEVO: Importar el hook para acceder al estado global de tareas/metas **
import { useTasks } from '../../context/TaskContext'; 

// Datos de ejemplo ESTÁTICOS 
const initialStaticEvents = [
  {
    id: '1',
    title: 'Revisar avance de Taller',
    date: '2025-10-17',
    allDay: true,
    color: '#0D6EFD', 
    extendedProps: {
      category: 'Tarea'
    }
  },
  {
    id: '2',
    title: 'Estudiar Matemáticas',
    date: '2025-10-18',
    allDay: true,
    color: '#198754', 
    extendedProps: {
      category: 'Estudio'
    }
  },
  // ... (otros eventos estáticos, si existen)
];

const mapTasksToEvents = (tasks) => {
    const getEventColor = (category) => {
        switch (category) {
            case 'tarea':
                return '#0D6EFD'; // Azul (Tareas)
            case 'meta':
                return '#198754'; // Verde (Metas)
            default:
                return '#6C757D'; // Gris (Por defecto)
        }
    };

    return tasks.map(item => ({
        id: item.id || String(Date.now() + Math.random()), 
        title: item.title,
        date: item.dueDate, 
        allDay: true, 
        color: getEventColor(item.category),
        extendedProps: {
            category: item.category,
            description: item.description,
            goalId: item.goalId || null,
        }
    }));
};


function CalendarView() {
  const { tasks } = useTasks();

  const contextEvents = mapTasksToEvents(tasks);
  
  // Combinamos los eventos estáticos con los eventos generados del contexto
  const allEvents = [...initialStaticEvents.filter(e => e.extendedProps.category !== 'Tarea'), ...contextEvents];
  
  const [events, setEvents] = useState(allEvents);

  // ** CORRECCIÓN DEL ERROR: useEffect debe estar importado **
  // Sincronizar eventos cuando las tareas del contexto cambian
  useEffect(() => {
    setEvents(allEvents);
  }, [tasks]); 


  const handleEventClick = (clickInfo) => {
    alert(`Evento seleccionado: ${clickInfo.event.title}\n
Categoría: ${clickInfo.event.extendedProps.category}\n
ID: ${clickInfo.event.id}`);
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Por favor, ingresa el título para el nuevo evento:');
    
    if (title) {
      const newEvent = {
        id: String(Date.now()), 
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color: '#6C757D' 
      };

      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' 
        }}
        
        initialView="dayGridMonth" 
        locale={esLocale} 
        
        selectable={true}      
        editable={true}        
        select={handleDateSelect}       
        eventClick={handleEventClick}   
        
        events={events} // Usa el estado que ahora incluye los eventos del contexto
      />
    </div>
  );
}

export default CalendarView;