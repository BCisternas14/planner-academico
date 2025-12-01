import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getOrCreateUser } from "@/lib/supabaseClient";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Nombre de Usuario",
      credentials: {
        username: { label: "Nombre", type: "text" },
      },
      async authorize(credentials) {
        // Esta función se ejecuta cuando llamas a signIn('credentials') en el frontend
        const { username } = credentials;

        try {
          // Buscamos o creamos el usuario en Supabase
          const user = await getOrCreateUser(username);

          if (user) {
            // Retornamos el objeto que NextAuth guardará en el token
            // Mapeamos 'id' y 'nombre' a lo que espera NextAuth
            return { id: user.id.toString(), name: user.nombre };
          }
          return null;
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 1. Cuando se crea el JWT, nos aseguramos de que el ID del usuario esté ahí
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 2. Cuando el frontend pide la sesión, le pasamos el ID del token a la sesión
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirigir aquí si hay error
  },
  secret: process.env.NEXTAUTH_SECRET, // Necesario para encriptar tokens
});

export { handler as GET, handler as POST };