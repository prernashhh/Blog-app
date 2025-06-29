import { getSession } from '../../../lib/auth';
import { parse } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const sessionId = cookies.session;
  
  console.log('🔍 Checking session:', sessionId);
  
  const session = getSession(sessionId);
  
  if (session) {
    console.log('✅ Valid session found:', session.user);
    return res.status(200).json({ 
      authenticated: true,
      user: session.user 
    });
  } else {
    console.log('❌ No valid session');
    return res.status(200).json({ 
      authenticated: false,
      user: null 
    });
  }
}
