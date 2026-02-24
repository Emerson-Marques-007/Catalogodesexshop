import { useParams, Link } from "react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Star, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";

export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#2D0A17] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
            Produto não encontrado
          </h2>
          <Link to="/catalogo" className="text-[#C3001A] flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const categoryLabel =
    product.category === "lingerie" ? "Lingerie" :
    product.category === "cosmeticos" ? "Cosméticos" :
    product.category === "aromaterapia" ? "Aromaterapia" :
    product.category === "presentes" ? "Kits & Presentes" :
    product.category === "acessorios" ? "Acessórios" :
    "Bem-Estar";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#F5D5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-[#6B3A4A]">
            <Link to="/" className="hover:text-[#C3001A]">Início</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-[#C3001A]">Catálogo</Link>
            <span>/</span>
            <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-[#C3001A]">{categoryLabel}</Link>
            <span>/</span>
            <span className="text-[#2D0A17]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className={`absolute top-4 left-4 ${
                product.badge === "Promoção" ? "bg-[#C3001A]" : product.badge === "Novo" ? "bg-[#E84B6A]" : "bg-[#F06292]"
              } text-white px-4 py-1.5 rounded-full text-xs uppercase tracking-wide`}>
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white"
            >
              <Heart className={`w-5 h-5 ${liked ? "text-[#C3001A] fill-[#C3001A]" : "text-[#6B3A4A]/40"}`} />
            </button>
          </div>

          {/* Details */}
          <div>
            <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">{categoryLabel}</p>
            <h1 className="text-[#2D0A17] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", lineHeight: "1.2" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-[#E84B6A] fill-[#E84B6A]"
                        : "text-[#F5D5D9] fill-[#F5D5D9]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B3A4A]">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[#C3001A]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-[#6B3A4A]/50 line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-[#C3001A]/10 text-[#C3001A] px-2 py-0.5 rounded text-xs">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-[#6B3A4A] mb-6" style={{ lineHeight: "1.7" }}>
              {product.description}
            </p>

            {/* Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="text-[#2D0A17] text-sm uppercase tracking-wider mb-3">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#6B3A4A]">
                      <Check className="w-4 h-4 text-[#E84B6A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-[#F5D5D9] rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#6B3A4A] hover:text-[#C3001A]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-[#2D0A17]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#6B3A4A] hover:text-[#C3001A]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  setQuantity(1);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#C3001A] text-white py-3 rounded-full hover:bg-[#2D0A17] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white rounded-xl border border-[#F5D5D9]">
              {[
                { icon: Truck, label: "Entrega Discreta", sub: "Em todo o Brasil" },
                { icon: Shield, label: "Compra Segura", sub: "Pagamento protegido" },
                { icon: RotateCcw, label: "Troca Fácil", sub: "Até 30 dias" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5D5D9] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#C3001A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#2D0A17]">{label}</p>
                    <p className="text-xs text-[#6B3A4A]/60">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="text-[#2D0A17] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}