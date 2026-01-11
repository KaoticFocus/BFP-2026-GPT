import Link from 'next/link';

export const metadata = {
  title: 'Reset password • BuildFlow Pro AI',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/signin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to sign in
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">Reset password</h1>
        <p className="mt-3 text-slate-300">
          Password reset isn’t wired up in this demo deployment.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="text-sm font-semibold text-slate-100">Use the demo account</div>
          <p className="mt-2 text-sm text-slate-300">
            Sign in with demo credentials and continue exploring the app.
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              href="/signin"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Go to sign in
            </Link>
            <Link
              href="/app/demo"
              className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
            >
              Open demo workspace
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

