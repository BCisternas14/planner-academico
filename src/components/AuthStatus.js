'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Cargando estado de la sesión...</div>
  }

  if (session) {
    return (
      // ... (El contenido de la sesión es el mismo)
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
        <p>
          ¡Bienvenido, **{session.user.name}**! Estás autenticado.
        </p>
        <button onClick={() => signOut()}>Cerrar Sesión</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
      <p>No estás autenticado.</p>
      {/* signIn() sin argumentos ahora dirige al formulario de credenciales. 
        Si quieres que se salte la página intermedia:
        <button onClick={() => signIn("credentials")}>Iniciar Sesión</button>
      */}
      <button onClick={() => signIn()}>Iniciar Sesión</button>
    </div>
  )
}