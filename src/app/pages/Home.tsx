import { Link } from "react-router";
import { ArrowRight, Truck, Shield, Gift, Clock } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { categories, products } from "../data/products";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import logoDark from "figma:asset/0466e0015d268c3edb1e92aeadc98a8983f906dc.png";
import tagline from "figma:asset/f92c5dcdaad7a6d756c87da306926cbc3efc03cd.png";
import brandArt from "figma:asset/9977de7bcfe2aebfc386c8cc27cf232e6c29ee99.png";
import brandPattern from "figma:asset/a149cf98651bbd922bd797d0193992389c849147.png";
import brandIcons from "figma:asset/2b39a4db8237453a5f749c8bcb98119fb3c9f474.png";

export function Home() {
  const featuredProducts = products.filter((p) => p.badge).slice(0, 4);
  const newProducts = products.filter((p) => p.badge === "Novo");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#C3001A] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={brandPattern} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <img
                src={logoDark}
                alt="Lujuria"
                className="h-12 sm:h-16 w-auto mb-6 mx-auto lg:mx-0"
              />
              <img
                src={tagline}
                alt="Liberte seus desejos"
                className="h-14 sm:h-20 lg:h-24 w-auto mb-8 mx-auto lg:mx-0"
              />
              <p className="text-white/80 mb-8 max-w-md mx-auto lg:mx-0" style={{ lineHeight: "1.7" }}>
                Descubra uma seleção exclusiva de produtos para tornar seus momentos mais intensos e prazerosos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#C3001A] px-8 py-3.5 rounded-full hover:bg-[#F5D5D9] transition-colors"
                >
                  Ver Catálogo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/categorias"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  Categorias
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src={brandArt}
                alt="Lujuria Art"
                className="w-72 h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-[#2D0A17] py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Truck, text: "Entrega Discreta" },
              { icon: Shield, text: "Compra Segura" },
              { icon: Gift, text: "Embalagem Especial" },
              { icon: Clock, text: "Suporte 24h" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 sm:gap-3 text-[#F5D5D9]/80">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E84B6A]" />
                <span className="text-xs sm:text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Explore</p>
            <h2 className="text-[#2D0A17]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
              Nossas Categorias
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.slice(0, 3).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} variant={i === 0 ? "large" : "default"} />
            ))}
            {categories.slice(3, 6).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Destaques</p>
              <h2 className="text-[#2D0A17]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
                Produtos em Destaque
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="hidden sm:flex items-center gap-2 text-[#C3001A] text-sm hover:gap-3 transition-all"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-[#C3001A] text-sm"
            >
              Ver todos os produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Banner */}
      <section className="relative py-20 sm:py-28 bg-[#F5D5D9] overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-10">
          <img src={brandPattern} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <img src={brandIcons} alt="Lujuria" className="h-10 sm:h-14 w-auto mx-auto mb-6 opacity-60" />
            <h2
              className="text-[#2D0A17] mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", lineHeight: "1.3" }}
            >
              Prazer, liberdade e autoconhecimento
            </h2>
            <p className="text-[#6B3A4A] mb-8" style={{ lineHeight: "1.7" }}>
              Na Lujuria, acreditamos que o prazer é um direito de todos. Nossos produtos são cuidadosamente selecionados para proporcionar experiências únicas e transformadoras.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 bg-[#C3001A] text-white px-8 py-3.5 rounded-full hover:bg-[#2D0A17] transition-colors"
            >
              Conheça nossa história
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* All Products Preview */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Novidades</p>
              <h2 className="text-[#2D0A17]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
                Chegaram Agora
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 border-2 border-[#C3001A] text-[#C3001A] px-8 py-3.5 rounded-full hover:bg-[#C3001A] hover:text-white transition-colors"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-[#2D0A17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2
              className="text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem" }}
            >
              Receba ofertas exclusivas
            </h2>
            <p className="text-[#F5D5D9]/60 text-sm mb-6">
              Cadastre-se e ganhe 10% de desconto na primeira compra
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 bg-white/10 text-white placeholder-white/40 px-5 py-3 rounded-full border border-white/10 focus:outline-none focus:border-[#E84B6A]"
              />
              <button
                type="button"
                className="bg-[#E84B6A] text-white px-8 py-3 rounded-full hover:bg-[#C3001A] transition-colors whitespace-nowrap"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
