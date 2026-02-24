import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Users as UsersIcon, Search, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export const AdminUsers: React.FC = () => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authFetch(`${API_BASE}/users`);

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'customer' | 'admin') => {
    if (!confirm(`Tem certeza que deseja alterar o papel deste usuário para ${newRole === 'admin' ? 'Administrador' : 'Cliente'}?`)) {
      return;
    }

    try {
      const response = await authFetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        toast.success('Papel do usuário atualizado com sucesso!');
        fetchUsers();
      } else {
        throw new Error('Erro ao atualizar papel do usuário');
      }
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Usuários</h1>
        <p className="text-white/60">Gerencie permissões e papéis dos usuários</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#FF1B8D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl">
          <UsersIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                  {user.role === 'admin' ? (
                    <Shield className={`w-6 h-6 ${user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`} />
                  ) : (
                    <User className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate mb-1">{user.name}</h3>
                  <p className="text-white/60 text-sm truncate mb-2">{user.email}</p>
                  
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </div>

              <div className="text-white/60 text-xs mb-4">
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </div>

              <select
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value as 'customer' | 'admin')}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]">
                <option value="customer">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};