import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 NextAuth v4 Authorize called');
        console.log('📧 Email:', credentials?.email);
        console.log('🔒 Password provided:', !!credentials?.password);
        console.log('🌍 Admin Email from env:', process.env.ADMIN_EMAIL);
        console.log('🔑 Admin Password set:', !!process.env.ADMIN_PASSWORD);
        
        if (
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          console.log('✅ AUTHENTICATION SUCCESS');
          const user = {
            id: '1',
            email: process.env.ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin'
          };
          console.log('👤 Returning user:', user);
          return user;
        }
        
        console.log('❌ AUTHENTICATION FAILED');
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT Callback v4');
      if (user) {
        console.log('🎫 Adding user to token:', user);
        token.role = user.role;
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('🔒 Session Callback v4');
      if (token) {
        console.log('🔒 Adding token to session:', token);
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
