import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <div className="w-full max-w-lg mx-4 p-8 rounded-xl bg-slate-900/70 border border-slate-700 shadow-lg text-center">
        <div className="text-6xl mb-4">404</div>
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          La pagina richiesta non esiste o e' stata spostata.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Torna alla Home
        </button>
      </div>
    </div>
  );
}
