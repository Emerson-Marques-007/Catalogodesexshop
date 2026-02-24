/**
 * 🎨 CONFIGURAÇÃO DE IMAGENS - LUJURIA SEX SHOP
 * 
 * Este arquivo centraliza TODAS as imagens do projeto.
 * Para trocar uma imagem, basta:
 * 1. Colocar o arquivo em /public/images/
 * 2. Atualizar o caminho aqui
 * 3. Pronto! A imagem será atualizada em todo o projeto automaticamente.
 */

// ========================================
// 📌 IMAGENS DE MARCA (BRAND ASSETS)
// ========================================

/**
 * Logos da marca
 * Formatos aceitos: .png, .svg
 * Tamanho recomendado: 300x100px (proporção mantida)
 */
export const BRAND_IMAGES = {
  // Logo principal (usado no header e páginas principais)
  logoDark: "/images/brand/logo-dark.png",
  
  // Logo alternativo para fundos claros
  logoLight: "/images/brand/logo-light.png",
  
  // Badge/selo circular da marca (usado no footer)
  logoBadge: "/images/brand/logo-badge.png",
  
  // Tagline/slogan da marca
  tagline: "/images/brand/tagline.png",
  
  // Arte decorativa da marca (ilustração)
  brandArt: "/images/brand/brand-art.png",
  
  // Padrão de fundo (textura decorativa)
  brandPattern: "/images/brand/brand-pattern.png",
  
  // Conjunto de ícones da marca
  brandIcons: "/images/brand/brand-icons.png",
} as const;

// ========================================
// 📦 IMAGENS DE PRODUTOS
// ========================================

/**
 * Imagens de categorias
 * Formatos aceitos: .jpg, .png, .webp
 * Tamanho recomendado: 1080x1080px
 */
export const CATEGORY_IMAGES = {
  lingerie: "/images/products/category-lingerie.jpg",
  cosmeticos: "/images/products/category-cosmeticos.jpg",
  acessorios: "/images/products/category-acessorios.jpg",
  aromaterapia: "/images/products/category-aromaterapia.jpg",
  bemEstar: "/images/products/category-bem-estar.jpg",
  presentes: "/images/products/category-presentes.jpg",
} as const;

/**
 * Imagens individuais de produtos
 * Para adicionar um produto, coloque a imagem em /public/images/products/
 * e adicione o caminho aqui seguindo o padrão: produto-XXX.jpg
 * 
 * Formatos aceitos: .jpg, .png, .webp
 * Tamanho recomendado: 800x800px ou 1200x1600px
 */
export const PRODUCT_IMAGES = {
  // Lingerie
  "ling-01": "/images/products/produto-ling-01.jpg",
  "ling-02": "/images/products/produto-ling-02.jpg",
  "ling-03": "/images/products/produto-ling-03.jpg",
  
  // Cosméticos
  "cos-01": "/images/products/produto-cos-01.jpg",
  "cos-02": "/images/products/produto-cos-02.jpg",
  "cos-03": "/images/products/produto-cos-03.jpg",
  
  // Aromaterapia
  "aro-01": "/images/products/produto-aro-01.jpg",
  "aro-02": "/images/products/produto-aro-02.jpg",
  
  // Presentes
  "pre-01": "/images/products/produto-pre-01.jpg",
  "pre-02": "/images/products/produto-pre-02.jpg",
  
  // Acessórios
  "ace-01": "/images/products/produto-ace-01.jpg",
  
  // Bem-estar
  "bem-01": "/images/products/produto-bem-01.jpg",
} as const;

// ========================================
// 🔧 HELPER FUNCTIONS
// ========================================

/**
 * Retorna o caminho da imagem de um produto pelo ID
 * Se não existir, retorna uma imagem placeholder do Unsplash
 */
export function getProductImage(productId: string): string {
  return PRODUCT_IMAGES[productId as keyof typeof PRODUCT_IMAGES] 
    || "/images/products/placeholder.jpg";
}

/**
 * Retorna o caminho da imagem de uma categoria pelo ID
 */
export function getCategoryImage(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    "lingerie": CATEGORY_IMAGES.lingerie,
    "cosmeticos": CATEGORY_IMAGES.cosmeticos,
    "acessorios": CATEGORY_IMAGES.acessorios,
    "aromaterapia": CATEGORY_IMAGES.aromaterapia,
    "bem-estar": CATEGORY_IMAGES.bemEstar,
    "presentes": CATEGORY_IMAGES.presentes,
  };
  
  return categoryMap[categoryId] || "/images/products/placeholder.jpg";
}

// ========================================
// 📋 INSTRUÇÕES DE USO
// ========================================

/**
 * COMO USAR ESTE ARQUIVO:
 * 
 * 1. Importe as constantes onde precisar:
 *    import { BRAND_IMAGES, getProductImage } from "../config/images";
 * 
 * 2. Use diretamente nos componentes:
 *    <img src={BRAND_IMAGES.logoDark} alt="Logo" />
 * 
 * 3. Para produtos, use a função helper:
 *    <img src={getProductImage("ling-01")} alt="Produto" />
 * 
 * 4. Para trocar uma imagem:
 *    - Coloque o novo arquivo em /public/images/
 *    - Atualize o caminho neste arquivo
 *    - Todas as referências serão atualizadas automaticamente!
 */
