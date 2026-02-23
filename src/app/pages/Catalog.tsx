import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/products";
import { useSearch } from "../contexts/SearchContext";

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("categoria") || "todos";
  const [sortBy, setSortBy] = useState("relevancia");
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [showFilters, setShowFilters] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== "todos") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "menor-preco":
        result.sort((a, b) => a.price - b.price);
        break;
      case "maior-preco":
        result.sort((a, b) => b.price - a.price);
        break;
      case "mais-vendidos":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case "melhor-avaliados":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [categoryFilter, sortBy, searchTerm]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "todos") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#2D0A17] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Lujuria</p>
          <h1 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem" }}>
            Catálogo
          </h1>
          <p className="text-[#F5D5D9]/60 mt-2">
            {filteredProducts.length} produtos encontrados
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-[#2D0A17] mb-4 bg-white px-4 py-2.5 rounded-lg shadow-sm w-full justify-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>

          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block mb-6 lg:mb-0`}>
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2D0A17] uppercase text-xs tracking-wider">Categorias</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-[#6B3A4A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange("todos")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryFilter === "todos"
                        ? "bg-[#C3001A] text-white"
                        : "text-[#6B3A4A] hover:bg-[#F5D5D9]"
                    }`}
                  >
                    Todos os Produtos
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        categoryFilter === cat.id
                          ? "bg-[#C3001A] text-white"
                          : "text-[#6B3A4A] hover:bg-[#F5D5D9]"
                      }`}
                    >
                      {cat.name}
                      <span className={`text-xs ${categoryFilter === cat.id ? "text-white/70" : "text-[#6B3A4A]/50"}`}>
                        {cat.productCount}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-[#F5D5D9]">
                <h3 className="text-[#2D0A17] uppercase text-xs tracking-wider mb-3">Faixa de Preço</h3>
                <div className="space-y-2">
                  {["Até R$ 50", "R$ 50 - R$ 100", "R$ 100 - R$ 200", "Acima de R$ 200"].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm text-[#6B3A4A] cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-[#F5D5D9] text-[#C3001A] focus:ring-[#E84B6A]" />
                      {range}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm text-[#6B3A4A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="relevancia">Relevância</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                  <option value="mais-vendidos">Mais Vendidos</option>
                  <option value="melhor-avaliados">Melhor Avaliados</option>
                </select>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 rounded ${gridCols === 3 ? "text-[#C3001A]" : "text-[#6B3A4A]/40"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 rounded ${gridCols === 2 ? "text-[#C3001A]" : "text-[#6B3A4A]/40"}`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B3A4A]">Buscando por:</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center gap-1 bg-[#E84B6A] text-white px-3 py-1 rounded-full text-xs"
                  >
                    "{searchTerm}"
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {categoryFilter !== "todos" && (
                <>
                  {!searchTerm && <span className="text-xs text-[#6B3A4A]">Filtros ativos:</span>}
                  <button
                    onClick={() => handleCategoryChange("todos")}
                    className="inline-flex items-center gap-1 bg-[#F5D5D9] text-[#C3001A] px-3 py-1 rounded-full text-xs"
                  >
                    {categories.find((c) => c.id === categoryFilter)?.name}
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>

            {/* Grid */}
            <div className={`grid gap-4 sm:gap-6 ${
              gridCols === 3
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#6B3A4A] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Nenhum produto encontrado
                </p>
                <p className="text-[#6B3A4A]/60 text-sm mt-2">
                  Tente alterar os filtros selecionados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}