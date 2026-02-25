import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth as getFirebaseAdminAuth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only once
export function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  
  try {
    return initializeApp({
      projectId: "studio-4435788400-d0d8b",
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

const adminApp = getAdminApp();
export const adminAuth = getFirebaseAdminAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
