import { Link } from "react-router";
import { ArrowRight, Heart, Sparkles, Shield, Users } from "lucide-react";
import { BRAND_IMAGES } from "../config/images";

export function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative bg-[#C3001A] py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={BRAND_IMAGES.brandPattern} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <img src={BRAND_IMAGES.logoBadge} alt="Lujuria" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", lineHeight: "1.2" }}>
            Nossa História
          </h1>
          <p className="text-white/70 max-w-lg mx-auto" style={{ lineHeight: "1.7" }}>
            Nascemos da vontade de democratizar o prazer e quebrar tabus com elegância, respeito e muito amor.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={BRAND_IMAGES.brandArt}
                alt="Lujuria Art"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Nossa Missão</p>
              <h2 className="text-[#2D0A17] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", lineHeight: "1.3" }}>
                Liberte Seus Desejos
              </h2>
              <p className="text-[#6B3A4A] mb-4" style={{ lineHeight: "1.8" }}>
                A Lujuria foi criada com o propósito de oferecer uma experiência de compra acolhedora, sem julgamentos e com muito bom gosto. Acreditamos que o prazer é um direito de todos e que explorar a própria sensualidade é um ato de autoconhecimento e liberdade.
              </p>
              <p className="text-[#6B3A4A] mb-6" style={{ lineHeight: "1.8" }}>
                Cada produto em nosso catálogo é cuidadosamente selecionado, priorizando qualidade, segurança e design. Trabalhamos com as melhores marcas nacionais e internacionais para garantir experiências inesquecíveis.
              </p>
              <img src={BRAND_IMAGES.tagline} alt="Liberte seus desejos" className="h-12 w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E84B6A] text-xs uppercase tracking-[0.2em] mb-2">Valores</p>
            <h2 className="text-[#2D0A17]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
              O Que Nos Move
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Respeito",
                description: "Tratamos cada cliente com acolhimento, empatia e sem julgamentos.",
              },
              {
                icon: Sparkles,
                title: "Qualidade",
                description: "Produtos selecionados com rigor para garantir sua satisfação.",
              },
              {
                icon: Shield,
                title: "Discrição",
                description: "Embalagens neutras e entrega sigilosa para sua tranquilidade.",
              },
              {
                icon: Users,
                title: "Inclusão",
                description: "Produtos e experiências para todos os corpos, gêneros e desejos.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-[#FDF0F2]">
                <div className="w-14 h-14 rounded-full bg-[#C3001A] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[#2D0A17] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h3>
                <p className="text-sm text-[#6B3A4A]" style={{ lineHeight: "1.6" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[#F5D5D9]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#2D0A17] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
            Pronta para explorar?
          </h2>
          <p className="text-[#6B3A4A] mb-8" style={{ lineHeight: "1.7" }}>
            Descubra nosso catálogo completo e encontre o produto perfeito para você ou para presentear quem ama.
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-[#C3001A] text-white px-8 py-3.5 rounded-full hover:bg-[#2D0A17] transition-colors"
          >
            Ver Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}