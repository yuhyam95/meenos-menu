
'use server';

import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';
import { Collection } from 'mongodb';
import clientPromise from '@/lib/db';
import { getSession } from './session';


const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key');

async function getUsersCollection(): Promise<Collection<Omit<User, 'id'>>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<Omit<User, 'id'>>('users');
}


// Auth Actions
export async function login(_prevState: unknown, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Invalid credentials' };
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({
    $or: [{ email: username }, { phone: username }],
  });

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: userPassword, ...payload } = user;

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}

export { getSession };
