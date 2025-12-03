'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleAuth0Login = () => {
    setLoading(true);
    // Esto redirige a la página universal de Auth0
    signIn('auth0', { callbackUrl: '/' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: '20px' }}>
          {/* Puedes poner aquí el logo de tu app */}
          <span className="material-icons" style={{ fontSize: '48px', color: '#4a90e2' }}>school</span>
        </div>
        
        <h2 style={styles.title}>Bienvenido</h2>
        <p style={styles.subtitle}>Ingresa a tu Planner Académico</p>

        <div style={styles.buttonContainer}>
          <button 
            onClick={handleAuth0Login} 
            style={styles.authButton}
            disabled={loading}
          >
            {loading ? 'Redirigiendo...' : 'Iniciar Sesión con Auth0 / GitHub'}
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
          Al iniciar sesión, tu cuenta se vinculará automáticamente.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f9', 
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  authButton: {
    padding: '14px',
    backgroundColor: '#24292e', // Color estilo GitHub/Oscuro
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'transform 0.1s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px'
  }
};