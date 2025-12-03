import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { getOrCreateUser } from "@/lib/supabaseClient";

const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: { params: { scope: "openid email profile" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },

    async jwt({ token, user, profile }) {
      if (user) {
        try {
          // Google suele devolver el nombre completo en 'user.name'.
          // Usamos eso, o el email si no hay nombre.
          const nombreParaDB = user.name || user.email;

          console.log("🔐 Usuario detectado (Auth0/Google):", nombreParaDB);

          // Sincronizamos con Supabase (Tu lógica original se mantiene igual)
          const dbUser = await getOrCreateUser(nombreParaDB);

          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("Error sincronizando usuario:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };