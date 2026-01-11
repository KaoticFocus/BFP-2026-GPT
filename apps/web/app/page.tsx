import Link from 'next/link';

type Feature = {
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    title: 'Review-first AI',
    description:
      'Drafts are generated quickly, but nothing “fires” until a human approves. Safer automation, better outcomes.',
  },
  {
    title: 'Approvals gate',
    description:
      'External side effects (emails, schedule changes, CO approvals) run through explicit approval requests.',
  },
  {
    title: 'Audit-ready by default',
    description:
      'Every AI interaction is logged. Stage changes, overrides, and decisions are traceable end-to-end.',
  },
  {
    title: 'Multi-tenant + RBAC',
    description:
      'Org-scoped data with role-based access control. Retrieval and actions respect permissions.',
  },
  {
    title: 'Events + outbox',
    description:
      'A resilient, event-driven backbone for cross-module coordination with idempotent consumers.',
  },
  {
    title: 'Docs + RAG',
    description:
      'Search your project knowledge with citations. Grounded answers from your documents (not vibes).',
  },
];

const MODULES = [
  'Universal Intake',
  'Leads / CloserFlow',
  'Projects',
  'Tasks + Daily Plans',
  'Meetings + Transcription',
  'Messaging Hub',
  'ScheduleFlow',
  'TimeClock',
  'Job Cost',
  'Change Orders',
  'Procurement',
  'SOP Gates',
  'Closeout + Reviews',
];

function GradientBlob({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute blur-3xl opacity-40',
        'bg-gradient-to-tr from-blue-500/40 via-cyan-500/30 to-indigo-500/30',
        className,
      ].join(' ')}
    />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GradientBlob className="-top-24 left-[-10rem] h-[28rem] w-[28rem] rounded-full" />
      <GradientBlob className="-bottom-24 right-[-12rem] h-[32rem] w-[32rem] rounded-full" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
            <span className="text-sm font-bold text-white">BF</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-100">BuildFlow Pro AI</div>
            <div className="text-xs text-slate-400">Construction ops, accelerated</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/docs"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900/60 hover:text-slate-100"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900/60 hover:text-slate-100"
          >
            Sign in
          </Link>
          <Link
            href="/app/demo"
            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
          >
            Open demo
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Deterministic demo data + end-to-end flow
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              Run your construction ops with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                review-first AI
              </span>
              .
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base text-slate-300 sm:text-lg">
              BuildFlow Pro AI turns messy inputs into structured drafts: leads, tasks, schedules, RFQs,
              change orders, closeout packets—always gated by approvals and backed by audit logs.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/app/demo"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
              >
                Open demo workspace
              </Link>
              <Link
                href="/docs"
                className="rounded-lg border border-slate-800 bg-slate-950/30 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
              >
                Documentation
              </Link>
              <Link
                href="/device"
                className="rounded-lg border border-slate-800 bg-slate-950/30 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
              >
                Device code login
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Multi-tenant org scoping
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Approvals for side effects
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                RAG with citations
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-100">Demo snapshot</div>
                <div className="text-xs text-slate-400">org: demo</div>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Inbox</div>
                  <div className="mt-1 text-sm text-slate-200">
                    “Customer wants a bathroom remodel; budget ~ $18k; timeline 4–6 weeks.”
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">AI draft</div>
                  <div className="mt-1 text-sm text-slate-200">
                    Lead created → scope outline → estimate draft → proposal draft
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-amber-200">
                      Pending approval
                    </span>
                    <span className="text-slate-500">No side effects until approved</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs text-slate-400">Audit log</div>
                  <div className="mt-1 text-sm text-slate-200">
                    Prompt + model + tokens + latency + citations captured
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-balance text-2xl font-semibold text-slate-50 sm:text-3xl">
          Designed for real-world construction workflows
        </h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          From lead intake to closeout reviews, every module is built around the same safety rails:
          scoped data, approvals, and auditable actions.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 hover:bg-slate-950/50"
            >
              <div className="text-sm font-semibold text-slate-100">{f.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-300">{f.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-50">What’s included</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                The demo workspace ships with seeded data and a deterministic end-to-end flow you can
                click through.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/app/demo"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Launch demo
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/50"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m}
                className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6">
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">© {new Date().getFullYear()} BuildFlow Pro AI. Demo build.</div>
          <div className="flex gap-4 text-sm">
            <Link href="/docs" className="text-slate-400 hover:text-slate-200">
              Docs
            </Link>
            <Link href="/device" className="text-slate-400 hover:text-slate-200">
              Device login
            </Link>
            <Link href="/app/demo" className="text-slate-400 hover:text-slate-200">
              Demo workspace
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
