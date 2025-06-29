import { deleteSession } from '../../../lib/auth';
import { parse, serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const sessionId = cookies.session;
  
  if (sessionId) {
    deleteSession(sessionId);
  }
  
  // Clear cookie
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });
  
  res.setHeader('Set-Cookie', cookie);
  console.log('🔓 Logout successful');
  
  return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
}
