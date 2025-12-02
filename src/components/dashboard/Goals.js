'use client';
import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { fetchUserGoals, createGoal } from '@/actions/goalActions';

// --- ARREGLO DEL ERROR ---
// Esta función es necesaria porque DashboardClient.js intenta importarla.
// Ahora busca la sesión y descarga los datos reales.
export async function fetchGoals() {
  try {
    const session = await getSession();
    if (!session?.user?.id) return [];
    
    // Usamos la Server Action para traer los datos reales
    const goals = await fetchUserGoals(session.user.id);
    return goals || [];
  } catch (error) {
    console.error("Error en fetchGoals:", error);
    return [];
  }
}

export default function Goals() {
  const { data: session } = useSession(); 
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar metas al iniciar
  useEffect(() => {
    async function loadGoals() {
      if (session?.user?.id) {
        const userGoals = await fetchUserGoals(session.user.id);
        setGoals(userGoals || []);
        setLoading(false);
      }
    }
    loadGoals();
  }, [session]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    if (!session?.user?.id) {
        alert("Debes iniciar sesión.");
        setIsSubmitting(false);
        return;
    }

    const result = await createGoal(session.user.id, formData);

    if (result.success) {
      setGoals([result.goal, ...goals]); 
      e.target.reset(); 
    } else {
      alert("Error: " + (result.error || "Desconocido"));
    }
    
    setIsSubmitting(false);
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completada).length;
  const progressPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  if (loading) return <div style={styles.card}>Cargando...</div>;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Mis Metas Académicas</h3>
      
      {/* Barra de Progreso */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBarBg}>
          <div 
            style={{...styles.progressBarFill, width: `${progressPercentage}%`}}
          ></div>
        </div>
        <p style={styles.progressText}>{progressPercentage}% Completado</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleCreateGoal} style={styles.form}>
        <input 
          name="titulo" 
          placeholder="Nueva meta (ej: Aprobar Cálculo)" 
          required 
          style={styles.input}
        />
        <input 
          name="fecha_limite" 
          type="date" 
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={styles.button}
        >
          {isSubmitting ? '...' : '+'}
        </button>
      </form>

      {/* Lista */}
      <ul style={styles.list}>
        {goals.length === 0 ? (
          <p style={styles.emptyText}>No tienes metas aún. ¡Agrega una!</p>
        ) : (
          goals.map((goal) => (
            <li key={goal.id} style={styles.listItem}>
              <div>
                <strong>{goal.titulo}</strong>
                <br/>
                <small style={{color: '#666'}}>
                  {goal.fecha_limite ? `Límite: ${new Date(goal.fecha_limite).toLocaleDateString()}` : 'Sin fecha'}
                </small>
              </div>
              <span style={{
                color: goal.completada ? 'green' : 'orange',
                fontWeight: 'bold',
                fontSize: '1.2em'
              }}>
                {goal.completada ? '✓' : '•'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '20px' },
  title: { marginBottom: '15px', fontSize: '18px', color: '#333' },
  progressContainer: { marginBottom: '20px' },
  progressBarBg: { width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4a90e2', transition: 'width 0.5s ease' },
  progressText: { textAlign: 'right', fontSize: '12px', color: '#666', marginTop: '5px' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 },
  button: { padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px' }
};