'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      // On successful login, ensure the admin role exists.
      const user = userCredential.user;
      const adminRoleRef = doc(db, 'roles_admin', user.uid);
      await setDoc(adminRoleRef, { createdAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      const authError = error as AuthError;
      // 'auth/invalid-credential' can mean user-not-found or wrong-password.
      // 'auth/user-not-found' is for older SDK versions.
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        try {
          // Try to create the user for the first-time login.
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          // On successful creation, create the admin role.
          const user = userCredential.user;
          const adminRoleRef = doc(db, 'roles_admin', user.uid);
          await setDoc(adminRoleRef, { createdAt: serverTimestamp() });
        } catch (createError) {
          const createAuthError = createError as AuthError;
          // If user already exists, it means password for sign-in was wrong.
          if (createAuthError.code === 'auth/email-already-in-use') {
            // Throw original error which indicates invalid credentials.
            throw error;
          }
          // For other creation errors, throw the new error.
          throw createError;
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    }
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
