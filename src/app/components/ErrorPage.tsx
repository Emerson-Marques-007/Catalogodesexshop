import { useRouteError, Link } from 'react-router';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export function ErrorPage() {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0a0f] via-[#3d1520] to-[#5a1a2e] px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-[#FF1B8D] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">Ops! Algo deu errado</h1>
        <p className="text-[#FFB6D9]/70 mb-6">
          {error?.message || error?.statusText || 'Ocorreu um erro inesperado.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF1B8D] text-white rounded-lg hover:bg-[#C2185B] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir para Início
          </Link>
        </div>
      </div>
    </div>
  );
}
