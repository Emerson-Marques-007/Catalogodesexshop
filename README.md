# 🛍️ Lujuria Sex Shop - Catálogo E-commerce

Catálogo completo de produtos com carrinho de compras, checkout e sistema de busca.

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| **[🎯 COMO_TROCAR_IMAGENS.md](./COMO_TROCAR_IMAGENS.md)** | ⭐ **COMECE AQUI!** Tutorial visual em 3 passos |
| **[📋 LISTA_IMAGENS.md](./LISTA_IMAGENS.md)** | Lista completa de todas as imagens necessárias |
| **[📚 GUIA_DESENVOLVEDOR.md](./GUIA_DESENVOLVEDOR.md)** | Documentação técnica detalhada |
| **[⚡ REFERENCIA_RAPIDA.md](./REFERENCIA_RAPIDA.md)** | Atalhos e comandos para desenvolvedores |
| **[🔧 TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Soluções para problemas comuns |
| **[✅ CHECKLIST.md](./CHECKLIST.md)** | Checklist de implementação (100+ itens) |
| **[📖 INDEX.md](./INDEX.md)** | Índice geral da documentação |
| **[🎉 RESUMO_COMPLETO.md](./RESUMO_COMPLETO.md)** | Resumo de tudo que foi feito |

---

## 🚀 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 📁 Estrutura Simplificada

```
src/app/
  ├── pages/          ← 6 páginas (Home, Catálogo, Categorias, Produto, Sobre, Checkout)
  ├── components/     ← Componentes reutilizáveis (Header, Footer, Cards, etc)
  ├── contexts/       ← Carrinho e Busca (Context API)
  ├── data/           ← Produtos e categorias (edite aqui para adicionar produtos)
  └── config/         ← Configuração de imagens (centralizadas)
```

---

## 📝 Ações Rápidas

### **Adicionar um novo produto:**
1. Abra `/src/app/data/products.ts`
2. Adicione na lista `products`:
```typescript
{
  id: "novo-01",
  name: "Nome do Produto",
  description: "Descrição...",
  price: 99.90,
  category: "lingerie",
  image: "/images/products/novo-01.jpg",
  rating: 4.5,
  reviews: 10,
  inStock: true,
}
```
3. Coloque a imagem em `/public/images/products/novo-01.jpg`

### **Mudar as cores do site:**
Edite `/src/styles/theme.css`:
```css
--color-primary: #2D0A17;    /* Bordô escuro */
--color-secondary: #E84B6A;  /* Rosa vibrante */
--color-accent: #C3001A;     /* Vermelho */
```

---

## 🛒 Funcionalidades

✅ **Carrinho de compras** completo (adicionar, remover, atualizar quantidade)  
✅ **Persistência** no localStorage (não perde ao fechar o navegador)  
✅ **Sistema de busca** integrado  
✅ **Filtros por categoria** e ordenação  
✅ **Checkout com 3 etapas** (Dados, Endereço, Pagamento)  
✅ **Animações suaves** em todos os componentes  
✅ **Totalmente responsivo** (mobile, tablet, desktop)  
✅ **Notificações toast** em todas as ações  

---

## 🎨 Paleta de Cores

- **#2D0A17** - Bordô escuro (fundo principal)
- **#E84B6A** - Rosa vibrante (botões e CTAs)
- **#C3001A** - Vermelho intenso (destaques)
- **#F5D5D9** - Rosa claro (textos)
- **#6B3A4A** - Cinza-rosa (textos secundários)

---

## 📦 Tecnologias

- React 18 + TypeScript
- Tailwind CSS v4
- React Router (Data Mode)
- Motion (animações)
- Lucide React (ícones)
- Sonner (notificações)

---

**🔥 Projeto pronto para produção!**