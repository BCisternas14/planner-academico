'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username.trim() === '') {
      setError('Por favor, ingresa tu nombre de usuario.');
      setLoading(false);
      return;
    }

    // Esto llama a nuestro archivo route.js en el servidor
    const result = await signIn('credentials', {
      username: username,
      redirect: false, 
    });

    if (result?.error) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(result.error);
      setLoading(false);
    } else {
      // Login exitoso
      router.push('/');
      router.refresh(); // Asegura que los componentes del servidor actualicen la sesión
    }
  };

  return (
    <div style={styles.container}>
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
            disabled={loading}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
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
    borderRadius: '10px', 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
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
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4a90e2', 
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    marginBottom: '10px',
    fontSize: '14px',
  },
};