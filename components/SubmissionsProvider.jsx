"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authClient } from "@/lib/auth-client";

const SubmissionsContext = createContext({
  submittedDepartments: [],
  isLoadingSubmissions: false,
  markDepartmentsSubmitted: () => {},
  refreshSubmissions: async () => {},
});

export function SubmissionsProvider({ children }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const fetchSubmissions = useCallback(async (email) => {
    if (!email) return;

    const cacheKey = `submitted_depts_${email}`;
    const cached =
      typeof window !== "undefined"
        ? sessionStorage.getItem(cacheKey)
        : null;

    if (cached) {
      try {
        setSubmittedDepartments(JSON.parse(cached));
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    setIsLoadingSubmissions(true);

    try {
      const res = await fetch(
        `/api/check-applications?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("Failed to fetch submissions");

      const data = await res.json();
      if (Array.isArray(data?.submittedDepartments)) {
        setSubmittedDepartments(data.submittedDepartments);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify(data.submittedDepartments)
          );
        }
      }
    } catch (err) {
      console.error("Error fetching user submissions:", err);
    } finally {
      setIsLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchSubmissions(user.email);
    } else {
      setSubmittedDepartments([]);
    }
  }, [user?.email, fetchSubmissions]);

  const markDepartmentsSubmitted = useCallback(
    (newDepartments) => {
      setSubmittedDepartments((prev) => {
        const merged = [...new Set([...prev, ...newDepartments])];
        if (typeof window !== "undefined" && user?.email) {
          sessionStorage.setItem(
            `submitted_depts_${user.email}`,
            JSON.stringify(merged)
          );
        }
        return merged;
      });
    },
    [user?.email]
  );

  const refreshSubmissions = useCallback(async () => {
    if (user?.email) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`submitted_depts_${user.email}`);
      }
      await fetchSubmissions(user.email);
    }
  }, [user?.email, fetchSubmissions]);

  return (
    <SubmissionsContext.Provider
      value={{
        submittedDepartments,
        isLoadingSubmissions,
        markDepartmentsSubmitted,
        refreshSubmissions,
      }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw new Error(
      "useSubmissions must be used within a SubmissionsProvider"
    );
  }
  return context;
}