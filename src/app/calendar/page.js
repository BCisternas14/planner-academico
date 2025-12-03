"use client";
import React, { useState, useEffect } from 'react'; 
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 
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

    // --- CORRECCIÓN DE FECHA (Versión Simplificada) ---
    const fixDate = (dateStr) => {
        if (!dateStr) return undefined;
        
        // Simplemente tomamos los primeros 10 caracteres (YYYY-MM-DD)
        // Esto evita que JavaScript intente convertir zonas horarias y mueva el día.
        // Si la DB dice "2025-12-05T...", usaremos "2025-12-05".
        return dateStr.substring(0, 10);
    };

    return tasks.map(item => ({
        id: item.id || String(Date.now() + Math.random()), 
        title: item.title,
        date: fixDate(item.dueDate), 
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
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const contextEvents = mapTasksToEvents(tasks);
    // Mezclamos eventos estáticos + dinámicos
    const combined = [...initialStaticEvents, ...contextEvents];
    setEvents(combined);
  }, [tasks]); 

  const handleEventClick = (clickInfo) => {
    alert(`Evento: ${clickInfo.event.title}\nCategoría: ${clickInfo.event.extendedProps.category}`);
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Nuevo evento rápido:');
    if (title) {
      const newEvent = {
        id: String(Date.now()), 
        title,
        date: selectInfo.startStr, 
        allDay: true,
        color: '#6C757D' 
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek' 
        }}
        initialView="dayGridMonth" 
        locale={esLocale} 
        selectable={true}      
        editable={true}        
        select={handleDateSelect}       
        eventClick={handleEventClick}   
        events={events} 
        height="auto"
        dayMaxEvents={true} 
      />
    </div>
  );
}

export default CalendarView;