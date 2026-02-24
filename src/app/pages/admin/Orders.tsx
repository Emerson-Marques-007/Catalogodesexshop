import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Package, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

interface Order {
  id: string;
  userId: string;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente', color: 'yellow' },
  { value: 'processing', label: 'Em Processamento', color: 'blue' },
  { value: 'shipped', label: 'Enviado', color: 'purple' },
  { value: 'delivered', label: 'Entregue', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' }
];

export const AdminOrders: React.FC = () => {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await authFetch(`${API_BASE}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await authFetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Status atualizado com sucesso!');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        throw new Error('Erro ao atualizar status');
      }
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.message);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pedidos</h1>
        <p className="text-white/60">Gerencie todos os pedidos da loja</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Buscar pedidos por ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#FF1B8D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl">
          <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">
                      Pedido #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
                    </span>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-1">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  <p className="text-white/80 text-sm">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} • <span className="text-[#FF1B8D] font-bold">R$ {order.total.toFixed(2)}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]">
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" />
                    Detalhes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a0a0f] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Detalhes do Pedido
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/60 hover:text-white text-xl">
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Informações do Pedido</h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                  <p className="text-white/80">
                    <span className="text-white/60">ID:</span> {selectedOrder.id}
                  </p>
                  <p className="text-white/80">
                    <span className="text-white/60">Data:</span> {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-white/80">
                    <span className="text-white/60">Pagamento:</span> {selectedOrder.paymentMethod}
                  </p>
                  <p className="text-white/80">
                    <span className="text-white/60">Total:</span> <span className="text-[#FF1B8D] font-bold">R$ {selectedOrder.total.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Endereço de Entrega</h3>
                <div className="bg-white/5 rounded-lg p-4 text-sm text-white/80">
                  <p>{selectedOrder.shippingAddress?.fullName}</p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                  <p>CEP: {selectedOrder.shippingAddress?.zipCode}</p>
                  <p>Tel: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Itens do Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-white/60 text-sm">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="text-[#FF1B8D] font-bold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};