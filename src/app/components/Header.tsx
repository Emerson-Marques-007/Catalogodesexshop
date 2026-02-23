import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import logoLight from "figma:asset/bda2e3713b427a64eeb4bc8d887ca64de0784dd3.png";
import logoDark from "figma:asset/0466e0015d268c3edb1e92aeadc98a8983f906dc.png";
import { useCart } from "../contexts/CartContext";
import { useSearch } from "../contexts/SearchContext";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { getTotalItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Redireciona para o catálogo se não estiver lá
    if (value && location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/catalogo", label: "Catálogo" },
    { to: "/categorias", label: "Categorias" },
    { to: "/sobre", label: "Sobre" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#2D0A17]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-[#F5D5D9] hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logoDark} alt="Lujuria" className="h-8 sm:h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm tracking-wider uppercase transition-colors ${
                    location.pathname === link.to
                      ? "text-[#E84B6A]"
                      : "text-[#F5D5D9]/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#F5D5D9] hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="text-[#F5D5D9] hover:text-white transition-colors hidden sm:block">
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="text-[#F5D5D9] hover:text-white transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-[#E84B6A] text-white min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center"
                    style={{ fontSize: "10px" }}
                  >
                    {getTotalItems() > 99 ? "99+" : getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#E84B6A]"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#2D0A17] border-t border-white/10">
            <nav className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 text-sm tracking-wider uppercase transition-colors ${
                    location.pathname === link.to
                      ? "text-[#E84B6A]"
                      : "text-[#F5D5D9]/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}