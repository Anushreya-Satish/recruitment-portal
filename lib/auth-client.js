import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

/*
// ORIGINAL IMPLEMENTATION:
export const authClient = createAuthClient({
  plugins: [
    adminClient()
  ]
});
*/

// OPTIMIZED IMPLEMENTATION:
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || typeof window !== "undefined" ? window.location.origin : "",
  plugins: [
    adminClient(),
  ],
});

// Export convenience hooks for client component consumption
export const { useSession, signIn, signOut, signUp } = authClient;