
import 'server-only';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key');

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
