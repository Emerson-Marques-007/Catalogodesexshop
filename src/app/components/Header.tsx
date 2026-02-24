import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Search, ShoppingBag, Menu, X, Heart, User, LogOut, Shield } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";
import { CartDrawer } from "./CartDrawer";
import { BRAND_IMAGES } from "../config/images";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { getTotalItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, isAdmin, logout } = useAuth();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Redireciona para o catálogo se não estiver lá
    if (value && location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
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
              <img
                src={isHome ? BRAND_IMAGES.logoLight : BRAND_IMAGES.logoDark}
                alt="Lujuria"
                className="h-8 sm:h-10 w-auto"
              />
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
              
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="text-[#F5D5D9] hover:text-white transition-colors flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-[#2D0A17] border border-white/20 rounded-lg shadow-xl z-50">
                        <div className="p-3 border-b border-white/10">
                          <p className="text-white font-medium text-sm">{user.name}</p>
                          <p className="text-white/60 text-xs">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/perfil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#F5D5D9] hover:bg-white/10 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Meu Perfil
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-[#F5D5D9] hover:bg-white/10 transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Painel Admin
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#F5D5D9] hover:bg-white/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[#F5D5D9] hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">Entrar</span>
                </Link>
              )}
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
              {user && (
                <>
                  <hr className="border-white/10 my-2" />
                  <Link
                    to="/perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-sm tracking-wider uppercase text-[#F5D5D9]/80 hover:text-white"
                  >
                    Meu Perfil
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-sm tracking-wider uppercase text-[#F5D5D9]/80 hover:text-white"
                    >
                      Painel Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}