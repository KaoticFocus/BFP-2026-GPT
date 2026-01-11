'use client';

import { useState } from 'react';

export default function DeviceAuthPage() {
  const [userCode, setUserCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'confirming' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('confirming');
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/v1/auth/device/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode.toUpperCase() }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setError(data.error ?? 'Failed to confirm code');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-8">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Device Authorized!</h1>
          <p className="text-gray-600">You can close this window and return to your device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-buildflow-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Authorize Device</h1>
          <p className="mt-2 text-gray-600">Enter the code displayed on your device to authorize it.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="code" className="sr-only">
              Device Code
            </label>
            <input
              id="code"
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="XXXX-XXXX"
              className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-buildflow-500 focus:border-buildflow-500 text-center text-2xl font-mono tracking-wider"
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={userCode.length < 8 || status === 'confirming'}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-buildflow-600 hover:bg-buildflow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buildflow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'confirming' ? 'Authorizing...' : 'Authorize Device'}
          </button>
        </form>
      </div>
    </div>
  );
}
