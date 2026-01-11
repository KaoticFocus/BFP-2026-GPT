export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">BuildFlow Pro AI</h1>
      <p className="text-xl text-slate-400 mb-8">AI-powered construction project management</p>
      <div className="flex gap-4">
        <a
          href="/app/demo"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          Open Demo
        </a>
        <a
          href="/docs"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition"
        >
          API Docs
        </a>
      </div>
    </main>
  );
}
