import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Category } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "large";
}

export function CategoryCard({ category, variant = "default" }: CategoryCardProps) {
  const isLarge = variant === "large";

  return (
    <Link
      to={`/catalogo?categoria=${category.id}`}
      className={`group relative block overflow-hidden rounded-xl ${
        isLarge ? "aspect-[4/5] sm:aspect-[3/4]" : "aspect-square"
      }`}
    >
      <ImageWithFallback
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A17]/80 via-[#2D0A17]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p className="text-[#E84B6A] text-xs uppercase tracking-widest mb-1">
          {category.productCount} produtos
        </p>
        <h3
          className="text-white mb-1"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: isLarge ? "1.5rem" : "1.125rem" }}
        >
          {category.name}
        </h3>
        <p className="text-white/60 text-sm mb-3 hidden sm:block">{category.description}</p>
        <div className="flex items-center gap-2 text-[#E84B6A] text-sm group-hover:gap-3 transition-all">
          <span>Explorar</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
