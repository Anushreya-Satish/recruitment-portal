"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showNotice, setShowNotice] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-6 md:p-12 font-sans">
      <header className="max-w-5xl w-full mx-auto flex justify-between items-center pb-6 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight text-white">
            Recruitment Portal
          </span>
          <span className="text-xs text-neutral-500 font-mono">2026</span>
        </div>
        
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link 
            href="/departments" 
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Departments
          </Link>
          <Link 
            href="/auth/signin" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto my-auto w-full space-y-8 py-12">
        {showNotice && (
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 relative shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                  Notice
                </span>
                <h3 className="text-lg font-semibold text-white mt-1">
                  Welcome to the recruitment portal.
                </h3>
              </div>
              <span className="text-xs text-neutral-500 font-mono">(470)</span>
            </div>
            
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Sign in with your email address to begin your application. You can apply to up to two departments.
            </p>

            <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Active session telemetry: <strong className="text-neutral-300">55</strong>
              </span>
              <button
                onClick={() => setShowNotice(false)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md font-medium transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
            Recruitment 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to make your mark?
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-xl">
            Join our departments and work on real-world projects. Your journey starts here.
          </p>

          <div className="pt-2">
            <Link
              href="/departments"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25"
            >
              <span>Join us</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
        <div>Organization · Recruitment Portal 2026</div>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-neutral-300 transition">Home</Link>
          <span>·</span>
          <Link href="/departments" className="hover:text-neutral-300 transition">Departments</Link>
        </div>
      </footer>
    </div>
  );
}