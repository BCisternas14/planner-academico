// src/app/login/page.js
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (username.trim() === '') {
      setError('Por favor, ingresa tu nombre de usuario.');
      return;
    }

    const result = await signIn('credentials', {
      username: username,
      redirect: false, 
      callbackUrl: '/', 
    });

    if (result.error) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={styles.container}>
      {/* Panel de Login diseñado como una tarjeta */}
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Accede a tu Planificador Académico</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos para un look & feel de "tarjeta" y centrado
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    // Usamos el color de fondo general de tu app o un gris muy suave
    backgroundColor: 'var(--bg-light-gray, #f4f7f9)', 
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px', // Redondeo similar al de tus tarjetas
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Sombra suave
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: 'var(--text-dark, #333)',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-gray, #666)',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid var(--border-color, #ddd)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px',
    backgroundColor: 'var(--primary-color, #4a90e2)', // Usando un color primario
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'var(--error-color, #dc3545)',
    marginBottom: '10px',
    fontSize: '14px',
  },
};