"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Direct user to department selection after signing in
      router.push("/departments");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
            Recruitment Portal 2026
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Sign In</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Enter your email to start or continue your application.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="applicant@example.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm transition shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Continue to Selection &rarr;
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}