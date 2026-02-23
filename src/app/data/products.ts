export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "lingerie",
    name: "Lingerie",
    description: "Peças sensuais para todas as ocasiões",
    image: "https://images.unsplash.com/photo-1760837992224-e73b2ba6f1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsYWNlJTIwbGluZ2VyaWUlMjBmbGF0bGF5fGVufDF8fHx8MTc3MTU5MDc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 24,
  },
  {
    id: "cosmeticos",
    name: "Cosméticos",
    description: "Óleos, cremes e aromas irresistíveis",
    image: "https://images.unsplash.com/photo-1687195821497-fed0346cdc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBiZWF1dHklMjBwcm9kdWN0cyUyMHBpbmt8ZW58MXx8fHwxNzcxNTQxOTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 18,
  },
  {
    id: "acessorios",
    name: "Acessórios",
    description: "Complementos para momentos especiais",
    image: "https://images.unsplash.com/photo-1657295791913-5074c912398e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2F0aW4lMjBmYWJyaWMlMjBwaW5rfGVufDF8fHx8MTc3MTU5MDc0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 32,
  },
  {
    id: "aromaterapia",
    name: "Aromaterapia",
    description: "Velas, incensos e óleos essenciais",
    image: "https://images.unsplash.com/photo-1625189134246-7528bb3ed239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBhcm9tYXRoZXJhcHklMjBib3R0bGV8ZW58MXx8fHwxNzcxNTkwNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 15,
  },
  {
    id: "bem-estar",
    name: "Bem-Estar",
    description: "Produtos para cuidar do corpo e da mente",
    image: "https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwY3JlYW0lMjBza2luY2FyZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzE1OTA3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 20,
  },
  {
    id: "presentes",
    name: "Kits & Presentes",
    description: "Surpresas perfeitas para quem você ama",
    image: "https://images.unsplash.com/photo-1711363577101-c943af0b02c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMHBldGFscyUyMHJvbWFudGljfGVufDF8fHx8MTc3MTU5MDc1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 12,
  },
];

export const products: Product[] = [
  // Lingerie
  {
    id: "ling-01",
    name: "Conjunto Renda Francesa",
    description: "Conjunto luxuoso em renda francesa com detalhes artesanais. Disponível em vermelho e preto.",
    price: 189.90,
    originalPrice: 249.90,
    category: "lingerie",
    image: "https://images.unsplash.com/photo-1760837992224-e73b2ba6f1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsYWNlJTIwbGluZ2VyaWUlMjBmbGF0bGF5fGVufDF8fHx8MTc3MTU5MDc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Promoção",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    features: ["Renda francesa importada", "Fechamento em laço", "Tamanhos P ao GG"],
  },
  {
    id: "ling-02",
    name: "Body Transparência",
    description: "Body sensual com transparência estratégica e bordados delicados.",
    price: 159.90,
    category: "lingerie",
    image: "https://images.unsplash.com/photo-1617092027287-df9142fd043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWNlJTIwdW5kZXJ3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzE1OTA3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    features: ["Tecido stretch", "Bordados artesanais", "Tamanhos P ao GG"],
  },
  {
    id: "ling-03",
    name: "Camisola Seda Premium",
    description: "Camisola em seda natural com acabamento luxuoso e caimento perfeito.",
    price: 229.90,
    category: "lingerie",
    image: "https://images.unsplash.com/photo-1657295791913-5074c912398e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2F0aW4lMjBmYWJyaWMlMjBwaW5rfGVufDF8fHx8MTc3MTU5MDc0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Novo",
    rating: 4.9,
    reviews: 42,
    inStock: true,
    features: ["100% seda natural", "Alças ajustáveis", "Lavagem a mão"],
  },
  // Cosméticos
  {
    id: "cos-01",
    name: "Óleo de Massagem Sensual",
    description: "Óleo aromático com essência de rosas e jasmim para massagens relaxantes e sensuais.",
    price: 79.90,
    category: "cosmeticos",
    image: "https://images.unsplash.com/photo-1739912061342-280525e3c20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwb2lsJTIwY2FuZGxlcyUyMHJvbWFudGljfGVufDF8fHx8MTc3MTU5MDc0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    features: ["200ml", "Base vegetal", "Fragrância de rosas"],
  },
  {
    id: "cos-02",
    name: "Perfume Íntimo Afrodisíaco",
    description: "Fragrância exclusiva com notas afrodisíacas de baunilha, almíscar e sândalo.",
    price: 119.90,
    originalPrice: 149.90,
    category: "cosmeticos",
    image: "https://images.unsplash.com/photo-1765031089460-0909ddc3835a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmt8ZW58MXx8fHwxNzcxNTkwNzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Promoção",
    rating: 4.5,
    reviews: 178,
    inStock: true,
    features: ["50ml", "Longa duração", "Notas afrodisíacas"],
  },
  {
    id: "cos-03",
    name: "Creme Corporal Hidratante",
    description: "Creme hidratante com textura aveludada e perfume suave. Deixa a pele macia e sedosa.",
    price: 89.90,
    category: "cosmeticos",
    image: "https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwY3JlYW0lMjBza2luY2FyZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzE1OTA3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviews: 95,
    inStock: true,
    features: ["300ml", "Hidratação 24h", "Fragrância suave"],
  },
  // Aromaterapia
  {
    id: "aro-01",
    name: "Kit Velas Aromáticas",
    description: "Conjunto de 3 velas aromáticas com essências de lavanda, baunilha e canela.",
    price: 99.90,
    category: "aromaterapia",
    image: "https://images.unsplash.com/photo-1694068907461-d41001a74a9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGJlZHJvb20lMjBjYW5kbGVzJTIwbW9vZHxlbnwxfHx8fDE3NzE1OTA3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Mais Vendido",
    rating: 4.9,
    reviews: 312,
    inStock: true,
    features: ["3 unidades", "Cera de soja", "Duração 40h cada"],
  },
  {
    id: "aro-02",
    name: "Óleo Essencial Relaxante",
    description: "Blend de óleos essenciais para difusor. Combina lavanda, camomila e ylang-ylang.",
    price: 59.90,
    category: "aromaterapia",
    image: "https://images.unsplash.com/photo-1625189134246-7528bb3ed239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBhcm9tYXRoZXJhcHklMjBib3R0bGV8ZW58MXx8fHwxNzcxNTkwNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviews: 145,
    inStock: true,
    features: ["30ml", "100% natural", "Para difusor"],
  },
  // Presentes
  {
    id: "pre-01",
    name: "Kit Romance Completo",
    description: "Kit especial com vela aromática, óleo de massagem, pétalas de rosa e espumante.",
    price: 299.90,
    originalPrice: 399.90,
    category: "presentes",
    image: "https://images.unsplash.com/photo-1711363577101-c943af0b02c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMHBldGFscyUyMHJvbWFudGljfGVufDF8fHx8MTc3MTU5MDc1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Promoção",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    features: ["Embalagem premium", "4 itens inclusos", "Cartão personalizado"],
  },
  {
    id: "pre-02",
    name: "Kit Casal Apaixonado",
    description: "Experiência completa para dois. Inclui jogo de cartas, vendas, dados e guia sensual.",
    price: 149.90,
    category: "presentes",
    image: "https://images.unsplash.com/photo-1699294144121-52eb57493c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjByb21hbnRpYyUyMGhhbmRzfGVufDF8fHx8MTc3MTU5MDc1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    badge: "Novo",
    rating: 4.7,
    reviews: 34,
    inStock: true,
    features: ["5 itens inclusos", "Guia ilustrado", "Embalagem discreta"],
  },
  // Acessórios
  {
    id: "ace-01",
    name: "Máscara Veneziana Deluxe",
    description: "Máscara em renda com detalhes em strass. Perfeita para noites especiais.",
    price: 69.90,
    category: "acessorios",
    image: "https://images.unsplash.com/photo-1657295791913-5074c912398e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2F0aW4lMjBmYWJyaWMlMjBwaW5rfGVufDF8fHx8MTc3MTU5MDc0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.4,
    reviews: 89,
    inStock: true,
    features: ["Renda italiana", "Detalhes em strass", "Tamanho único"],
  },
  // Bem-estar
  {
    id: "bem-01",
    name: "Gel de Banho Sensual",
    description: "Gel de banho com fragrância envolvente e propriedades hidratantes.",
    price: 49.90,
    category: "bem-estar",
    image: "https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwY3JlYW0lMjBza2luY2FyZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzE1OTA3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.5,
    reviews: 120,
    inStock: true,
    features: ["250ml", "pH balanceado", "Fragrância duradoura"],
  },
];
