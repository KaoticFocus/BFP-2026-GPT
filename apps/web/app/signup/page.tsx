'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">Start your free trial</h1>
        <p className="mt-3 text-slate-300">
          Signup is <span className="font-semibold">disabled in this public demo</span>. Use the demo
          workspace or sign in with demo credentials.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="text-sm font-semibold text-slate-100">Request access (demo)</div>
          <p className="mt-2 text-sm text-slate-400">
            This form is informational only and won’t create an account.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label className="block">
              <div className="mb-2 text-sm text-slate-300">Work email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 opacity-70"
              disabled
            >
              Signup disabled (demo)
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/app/demo"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Open demo workspace
            </Link>
            <Link
              href="/signin"
              className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">Demo credentials</div>
            <div className="mt-1 text-slate-300">Email: owner@demo.buildflow.local</div>
            <div className="text-slate-300">Password: demo</div>
          </div>
        </div>
      </div>
    </main>
  );
}

