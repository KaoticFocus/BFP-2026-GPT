import Link from 'next/link';

export const metadata = {
  title: 'Docs • BuildFlow Pro AI',
  description: 'Documentation and deployment notes for the BuildFlow Pro AI demo.',
};

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <div className="text-sm text-slate-400">BuildFlow Pro AI</div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-50">Documentation</h1>
        <p className="mt-3 text-slate-300">
          This is a public landing page for project docs and quick links. The in-app “Docs” module
          lives under an org workspace.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="text-sm font-semibold text-slate-100">Quick links</div>
          <div className="mt-4 flex flex-wrap gap-3">
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
            <Link
              href="/device"
              className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
            >
              Device code login
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="text-sm font-semibold text-slate-100">In-app documents</div>
          <p className="mt-2 text-sm text-slate-300">
            Once you’re inside an org, the documents module is available at:
          </p>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
            <span className="text-slate-400">/app/</span>
            <span className="font-semibold">demo</span>
            <span className="text-slate-400">/docs</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="text-sm font-semibold text-slate-100">API docs (requires API)</div>
          <p className="mt-2 text-sm text-slate-300">
            The Next.js app proxies API endpoints under <span className="font-mono">/api/*</span>.
            To use API docs in production, set <span className="font-mono">NEXT_PUBLIC_API_URL</span>{' '}
            to your hosted API URL.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-900 pt-6 text-sm text-slate-400">
        <Link href="/" className="text-slate-300 hover:text-slate-100">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
