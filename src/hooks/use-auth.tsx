'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { ADMIN_EMAIL } from '@/lib/constants';
import { LoginSchema } from '@/lib/schemas';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (values: z.infer<typeof LoginSchema>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (values: z.infer<typeof LoginSchema>) => {
    if (values.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error('You are not authorized to access this application.');
    }
    await signInWithEmailAndPassword(auth, values.email, values.password);
    router.push('/dashboard');
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
