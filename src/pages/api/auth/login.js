import { validateCredentials, createSession } from '../../../lib/auth';
import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  console.log('🔐 Custom login attempt');
  console.log('📧 Email received:', email);
  console.log('🔒 Password received:', !!password);

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  const user = validateCredentials(email, password);

  if (user) {
    const sessionId = createSession(user);
    
    // Set cookie
    const cookie = serialize('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    res.setHeader('Set-Cookie', cookie);
    console.log('✅ Custom login successful, session created:', sessionId);
    
    return res.status(200).json({ 
      success: true, 
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
}
