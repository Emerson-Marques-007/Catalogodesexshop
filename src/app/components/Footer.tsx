import { Link } from "react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { BRAND_IMAGES } from "../config/images";

export function Footer() {
  return (
    <footer className="bg-[#2D0A17] text-[#F5D5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={BRAND_IMAGES.logoBadge} alt="Lujuria" className="w-20 h-20 mb-4" />
            <p className="text-[#F5D5D9]/70 text-sm mb-4" style={{ lineHeight: "1.6" }}>
              Liberte seus desejos com produtos selecionados para tornar seus momentos inesquecíveis.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E84B6A] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E84B6A] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E84B6A] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/catalogo", label: "Catálogo Completo" },
                { to: "/categorias", label: "Categorias" },
                { to: "/catalogo?badge=promo", label: "Promoções" },
                { to: "/catalogo?badge=novo", label: "Novidades" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#F5D5D9]/60 hover:text-[#E84B6A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4">Informações</h4>
            <ul className="space-y-2.5">
              {["Sobre Nós", "Política de Privacidade", "Termos de Uso", "Trocas e Devoluções"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-[#F5D5D9]/60 hover:text-[#E84B6A] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#F5D5D9]/60">
                <Phone className="w-4 h-4 text-[#E84B6A]" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2 text-sm text-[#F5D5D9]/60">
                <Mail className="w-4 h-4 text-[#E84B6A]" />
                contato@lujuria.com.br
              </li>
              <li className="flex items-start gap-2 text-sm text-[#F5D5D9]/60">
                <MapPin className="w-4 h-4 text-[#E84B6A] flex-shrink-0 mt-0.5" />
                Rua dos Desejos, 69 - São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-[#F5D5D9]/40">
            &copy; 2026 Lujuria Sex Shop. Todos os direitos reservados. Venda exclusiva para maiores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  );
}