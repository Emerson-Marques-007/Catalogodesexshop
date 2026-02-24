import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export const AdminDashboard: React.FC = () => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await authFetch(`${API_BASE}/stats`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Produtos Cadastrados',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Usuários Registrados',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF1B8D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Bem-vindo ao painel administrativo da Lujuria</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`${card.bgColor} backdrop-blur-md rounded-2xl p-6 border ${card.borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-white/60 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Orders Alert */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-500/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-400 font-semibold mb-1">
                Pedidos Pendentes
              </h3>
              <p className="text-white/80 text-sm mb-3">
                Você tem {stats.pendingOrders} {stats.pendingOrders === 1 ? 'pedido pendente' : 'pedidos pendentes'} aguardando processamento.
              </p>
              <Link
                to="/admin/pedidos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 hover:scale-105 active:scale-95 transition-all text-sm font-medium">
                Ver Pedidos
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/produtos"
            className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#FF1B8D]/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Package className="w-8 h-8 text-[#FF1B8D]" />
            <div>
              <h3 className="text-white font-medium">Novo Produto</h3>
              <p className="text-white/60 text-sm">Adicionar ao catálogo</p>
            </div>
          </Link>

          <Link
            to="/admin/pedidos"
            className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#FF1B8D]/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <ShoppingCart className="w-8 h-8 text-[#FF1B8D]" />
            <div>
              <h3 className="text-white font-medium">Gerenciar Pedidos</h3>
              <p className="text-white/60 text-sm">Ver todos os pedidos</p>
            </div>
          </Link>

          <Link
            to="/admin/usuarios"
            className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#FF1B8D]/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Users className="w-8 h-8 text-[#FF1B8D]" />
            <div>
              <h3 className="text-white font-medium">Usuários</h3>
              <p className="text-white/60 text-sm">Gerenciar permissões</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};