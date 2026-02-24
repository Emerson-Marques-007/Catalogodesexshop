import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Shield, Package, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export const Profile: React.FC = () => {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await authFetch(`${API_BASE}/orders/my-orders`);

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0f] via-[#3d1520] to-[#5a1a2e] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF1B8D] to-[#C2185B] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <div className="flex items-center gap-2 text-[#FFB6D9] mb-1">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.createdAt && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {user?.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF1B8D] to-[#C2185B] text-white font-semibold rounded-lg shadow-lg">
                  <Shield className="w-5 h-5" />
                  Painel Admin
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                <LogOut className="w-5 h-5" />
                Sair
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-[#FF1B8D]" />
            <h2 className="text-2xl font-bold text-white">Meus Pedidos</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#FF1B8D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-4">Você ainda não fez nenhum pedido</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalogo')}
                className="px-6 py-3 bg-gradient-to-r from-[#FF1B8D] to-[#C2185B] text-white font-semibold rounded-lg">
                Explorar Produtos
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#FF1B8D]/50 transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Pedido #{order.id.slice(0, 8)}</p>
                      <p className="text-white/80 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/60 text-sm mb-2">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};