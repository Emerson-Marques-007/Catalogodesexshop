import React, { useState } from 'react';
import { products, categories } from '../../data/products';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

export const DataMigration: React.FC = () => {
  const { authFetch, isAdmin } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-white">Você precisa ser admin para acessar esta página</p>
      </div>
    );
  }

  const migrateCategories = async () => {
    const categoryResults = [];
    
    for (const category of categories) {
      try {
        const response = await authFetch(`${API_BASE}/categories`, {
          method: 'POST',
          body: JSON.stringify(category)
        });

        if (response.ok) {
          categoryResults.push({ type: 'category', name: category.name, status: 'success' });
        } else {
          const data = await response.json();
          categoryResults.push({ type: 'category', name: category.name, status: 'error', error: data.error });
        }
      } catch (error: any) {
        categoryResults.push({ type: 'category', name: category.name, status: 'error', error: error.message });
      }
    }
    
    return categoryResults;
  };

  const migrateProducts = async () => {
    const productResults = [];
    
    for (const product of products) {
      try {
        const response = await authFetch(`${API_BASE}/products`, {
          method: 'POST',
          body: JSON.stringify(product)
        });

        if (response.ok) {
          productResults.push({ type: 'product', name: product.name, status: 'success' });
        } else {
          const data = await response.json();
          productResults.push({ type: 'product', name: product.name, status: 'error', error: data.error });
        }
      } catch (error: any) {
        productResults.push({ type: 'product', name: product.name, status: 'error', error: error.message });
      }
    }
    
    return productResults;
  };

  const handleMigration = async () => {
    setMigrating(true);
    setResults([]);

    try {
      toast.info('Iniciando migração de categorias...');
      const categoryResults = await migrateCategories();
      setResults(prev => [...prev, ...categoryResults]);
      
      toast.info('Iniciando migração de produtos...');
      const productResults = await migrateProducts();
      setResults(prev => [...prev, ...productResults]);
      
      toast.success('Migração concluída!');
    } catch (error) {
      toast.error('Erro durante a migração');
      console.error(error);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Migração de Dados</h1>
        <p className="text-white/60">
          Migre categorias e produtos do arquivo local para o banco de dados
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Atenção</h3>
        <p className="text-white/80 text-sm">
          Esta operação irá criar {categories.length} categorias e {products.length} produtos no banco de dados.
          Execute apenas uma vez para evitar duplicatas.
        </p>
      </div>

      <motion.button
        onClick={handleMigration}
        disabled={migrating}
        whileHover={{ scale: migrating ? 1 : 1.02 }}
        whileTap={{ scale: migrating ? 1 : 0.98 }}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF1B8D] to-[#C2185B] text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {migrating ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            Migrando dados...
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            Iniciar Migração
          </>
        )}
      </motion.button>

      {results.length > 0 && (
        <div className="bg-white/10 rounded-xl p-6 space-y-2">
          <h3 className="text-white font-semibold mb-4">Resultados da Migração</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  result.status === 'success'
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                {result.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {result.type === 'category' ? '📁' : '📦'} {result.name}
                  </p>
                  {result.error && (
                    <p className="text-red-400 text-xs mt-1">{result.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};