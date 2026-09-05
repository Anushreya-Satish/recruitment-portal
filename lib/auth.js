import { betterAuth } from "better-auth";
import { firestoreAdapter } from "better-auth-firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

/*
// ORIGINAL IMPLEMENTATION (Issues identified):
// 1. Unchecked Google provider initialization: Passing empty/undefined credentials 
//    causes runtime crashes if environmental secrets are missing.
// 2. Missing user creation hooks to sync new authenticated users with custom application records.

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
const firestore = getFirestore(app);
*/

// OPTIMIZED IMPLEMENTATION:
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
const firestore = getFirestore(app);

// Safeguard social provider configuration to prevent crashes during initial setup
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: firestoreAdapter({
    firestore,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reduces re-login and session creation writes)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    updateAge: 60 * 60 * 24, // 1 day (prevents frequent database writes)
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(), // Must remain the last plugin in the array
  ],
});