import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Username Only",
      credentials: {
        username: { label: "Nombre", type: "text" },
      },
      async authorize(credentials) {
        const username = credentials.username.trim();

        if (!username) return null;

        return { id: "1", name: username };
      }
    })
  ],

  pages: {
    signIn: "/login"
  }
});

export { handler as GET, handler as POST };
