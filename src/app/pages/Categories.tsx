import { CategoryCard } from "../components/CategoryCard";
import { categories } from "../data/products";

export function Categories() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#2D0A17] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Explore</p>
          <h1 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem" }}>
            Categorias
          </h1>
          <p className="text-[#F5D5D9]/60 mt-2">
            Encontre exatamente o que procura
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} variant="large" />
          ))}
        </div>
      </div>
    </div>
  );
}
