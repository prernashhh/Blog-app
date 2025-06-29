// Simple session management without NextAuth
let sessions = new Map(); // In production, use Redis or database

export function createSession(user) {
  const sessionId = Math.random().toString(36).substring(2, 15);
  const session = {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    createdAt: new Date()
  };
  sessions.set(sessionId, session);
  return sessionId;
}

export function getSession(sessionId) {
  if (!sessionId) return null;
  
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  if (new Date() > session.expires) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function validateCredentials(email, password) {
  console.log('🔐 Custom Auth - Validating credentials');
  console.log('📧 Email:', email);
  console.log('🔒 Password provided:', !!password);
  console.log('🌍 Expected email:', process.env.ADMIN_EMAIL);
  console.log('🔑 Expected password set:', !!process.env.ADMIN_PASSWORD);
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    console.log('✅ CUSTOM AUTH SUCCESS');
    return {
      id: '1',
      email: process.env.ADMIN_EMAIL,
      name: 'Admin',
      role: 'admin'
    };
  }
  
  console.log('❌ CUSTOM AUTH FAILED');
  return null;
}
