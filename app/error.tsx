"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
      `}</style>
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">⚠️</p>
        <h1 className="font-serif text-3xl text-stone-900 mb-3">Something went wrong</h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          We ran into an unexpected issue. Please try again — if the problem
          persists, we&apos;re already on it.
        </p>
        {error?.digest && (
          <p className="text-xs text-stone-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-stone-900 text-white rounded-2xl font-semibold text-sm hover:bg-stone-800 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
