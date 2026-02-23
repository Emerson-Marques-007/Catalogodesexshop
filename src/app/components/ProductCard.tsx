import { Link } from "react-router";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const badgeColor = product.badge === "Promoção"
    ? "bg-[#C3001A]"
    : product.badge === "Novo"
    ? "bg-[#E84B6A]"
    : "bg-[#F06292]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/produto/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 ${badgeColor} text-white px-3 py-1 rounded-full text-xs tracking-wide uppercase`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            liked ? "text-[#C3001A] fill-[#C3001A]" : "text-[#2D0A17]/40"
          }`}
        />
      </motion.button>

      {/* Quick add */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => addToCart(product)}
        className="absolute bottom-[calc(35%+8px)] right-3 w-10 h-10 rounded-full bg-[#2D0A17] text-white flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#E84B6A]"
      >
        <ShoppingBag className="w-4 h-4" />
      </motion.button>

      {/* Info */}
      <div className="p-4">
        <Link to={`/produto/${product.id}`}>
          <p className="text-xs text-[#E84B6A] uppercase tracking-wider mb-1">
            {product.category === "lingerie" ? "Lingerie" :
             product.category === "cosmeticos" ? "Cosméticos" :
             product.category === "aromaterapia" ? "Aromaterapia" :
             product.category === "presentes" ? "Kits & Presentes" :
             product.category === "acessorios" ? "Acessórios" :
             "Bem-Estar"}
          </p>
          <h3 className="text-[#2D0A17] mb-1 group-hover:text-[#C3001A] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-[#E84B6A] fill-[#E84B6A]"
                    : "text-[#F5D5D9] fill-[#F5D5D9]"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#6B3A4A]">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[#C3001A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#6B3A4A]/60 line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}