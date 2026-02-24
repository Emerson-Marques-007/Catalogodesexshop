import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { FolderOpen, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-23ba5d8a`;

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const AdminCategories: React.FC = () => {
  const { authFetch } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    id: '',
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await authFetch(`${API_BASE}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `${API_BASE}/categories/${editingCategory.id}`
        : `${API_BASE}/categories`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Categoria atualizada!' : 'Categoria criada!');
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ id: '', name: '', description: '', image: '' });
        fetchCategories();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar categoria');
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      const response = await authFetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Categoria deletada com sucesso!');
        fetchCategories();
      } else {
        throw new Error('Erro ao deletar categoria');
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({ id: '', name: '', description: '', image: '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categorias</h1>
          <p className="text-white/60">Gerencie as categorias de produtos</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF1B8D] to-[#C2185B] text-white font-semibold rounded-lg shadow-lg">
          <Plus className="w-5 h-5" />
          Nova Categoria
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#FF1B8D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl">
          <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Nenhuma categoria encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
              <div className="aspect-video bg-white/5 relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">
                    {category.productCount || 0} produtos
                  </span>
                  <span className="px-3 py-1 bg-[#FF1B8D]/20 text-[#FF1B8D] rounded-full text-xs font-medium">
                    ID: {category.id}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Edit className="w-4 h-4" />
                    Editar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a0a0f] rounded-2xl max-w-2xl w-full border border-white/20">
            <div className="bg-[#1a0a0f] border-b border-white/20 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-white mb-2">ID da Categoria</label>
                <input
                  type="text"
                  required
                  disabled={!!editingCategory}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1B8D] disabled:opacity-50"
                  placeholder="ex: lingerie, cosmeticos"
                />
                <p className="text-white/40 text-xs mt-1">Use apenas letras minúsculas, números e hífens. Este ID será usado nas URLs.</p>
              </div>

              <div>
                <label className="block text-white mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]"
                  placeholder="Ex: Lingerie"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Descrição</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]"
                  placeholder="Descreva a categoria"
                />
              </div>

              <div>
                <label className="block text-white mb-2">URL da Imagem</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1B8D]"
                  placeholder="https://..."
                />
              </div>

              {formData.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
                  <img 
                    src={formData.image} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF1B8D] to-[#C2185B] text-white font-semibold rounded-lg">
                  <Save className="w-5 h-5" />
                  Salvar
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20">
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};