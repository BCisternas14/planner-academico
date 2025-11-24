"use client";
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // Para poner el calendario en español

// Datos de ejemplo. Eventualmente, esto vendrá de la Base de Datos.
// Nota cómo diferenciamos Tareas (allDay: true) de Eventos (con start/end).
const initialEvents = [
  {
    id: '1',
    title: 'Revisar avance de Taller',
    date: '2025-10-17',
    allDay: true,
    color: '#0D6EFD', // Azul (Ej: Tarea)
    extendedProps: {
      category: 'Tarea'
    }
  },
  {
    id: '2',
    title: 'Estudiar Matemáticas',
    date: '2025-10-18',
    allDay: true,
    color: '#198754', // Verde (Ej: Estudio)
    extendedProps: {
      category: 'Estudio'
    }
  },
  {
    id: '3',
    title: 'Entregar Proyecto',
    date: '2025-10-20',
    allDay: true,
    color: '#0D6EFD',
    extendedProps: {
      category: 'Tarea'
    }
  },
  {
    id: '4',
    title: 'Clase de Cálculo',
    start: '2025-10-21T10:00:00',
    end: '2025-10-21T11:30:00',
    color: '#DC3545', // Rojo (Ej: Clases/Pruebas)
    extendedProps: {
      category: 'Clases'
    }
  }
];

function CalendarView() {
  // En un futuro, usarías setEvents para añadir nuevos eventos desde la API
  const [events, setEvents] = useState(initialEvents);

  /**
   * INTERACCIÓN 1: Clic en un evento existente (Abre Modal de Edición)
   * Aquí es donde se debe llamar al Modal para "Editar" o "Eliminar"
   */
  const handleEventClick = (clickInfo) => {
    // A modo de ejemplo, usamos un 'alert'.
    // Aquí se debería abrir el Modal de edición pasando clickInfo.event
    alert(`Evento seleccionado: ${clickInfo.event.title}\n
Categoría: ${clickInfo.event.extendedProps.category}\n
ID: ${clickInfo.event.id}`);
    
    // (Lógica para abrir el Modal de Edición)
  };

  /**
   * INTERACCIÓN 2: Clic y arrastre en un espacio vacío (Abre Modal de Creación)
   * Esto implementa el "evento rápido"
   */
  const handleDateSelect = (selectInfo) => {
    // A modo de ejemplo, usamos un 'prompt'.
    // Aquí se debería abrir el Modal de creación
    let title = prompt('Por favor, ingresa el título para el nuevo evento:');
    
    if (title) {
      const newEvent = {
        id: String(Date.now()), // ID temporal
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color: '#6C757D' // Color por defecto para nuevos eventos
      };

      // Añadimos el nuevo evento al estado del calendario
      setEvents([...events, newEvent]);
      
      // (Aquí iría la llamada a la API para guardar el newEvent en la DB)
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' // Vistas disponibles
        }}
        
        initialView="timeGridWeek"
        locale={esLocale} // Español
        
        // --- Interacciones ---
        selectable={true}      // Permite seleccionar fechas/horas
        editable={true}        // Permite arrastrar y redimensionar eventos (opcional)
        select={handleDateSelect}       // Acción al seleccionar
        eventClick={handleEventClick}   // Acción al hacer clic en un evento
        
        // --- Fuente de Datos ---
        events={events} // Los eventos que vienen del estado
      />
    </div>
  );
}

export default CalendarView;