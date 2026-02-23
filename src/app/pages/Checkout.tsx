import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, MapPin, User, Package, Truck } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { toast } from "sonner";

interface FormData {
  // Dados pessoais
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  
  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Pagamento
  paymentMethod: "credit" | "debit" | "pix" | "boleto";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Simulação de processamento de pagamento
    toast.success("Pedido realizado com sucesso!");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#2D0A17] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
            Seu carrinho está vazio
          </h2>
          <Link to="/catalogo" className="text-[#C3001A] flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 15.90;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/catalogo" className="flex items-center gap-2 text-[#6B3A4A] hover:text-[#C3001A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar às compras
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: "Dados Pessoais", icon: User },
              { num: 2, label: "Endereço", icon: MapPin },
              { num: 3, label: "Pagamento", icon: CreditCard },
            ].map(({ num, label, icon: Icon }, i) => (
              <div key={num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= num
                        ? "bg-[#E84B6A] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step > num ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-[#6B3A4A] hidden sm:block">{label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors ${
                      step > num ? "bg-[#E84B6A]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              {/* Step 1: Personal Data */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#2D0A17] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
                      Dados Pessoais
                    </h2>
                    <p className="text-[#6B3A4A] text-sm">
                      Preencha seus dados para continuar
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-[#2D0A17] mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="Digite seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">E-mail *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Telefone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm text-[#2D0A17] mb-2">CPF *</label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-[#E84B6A] text-white py-3 rounded-lg hover:bg-[#C3001A] transition-colors"
                  >
                    Continuar para Endereço
                  </button>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#2D0A17] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
                      Endereço de Entrega
                    </h2>
                    <p className="text-[#6B3A4A] text-sm">
                      Entrega discreta e segura
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">CEP *</label>
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => handleInputChange("cep", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm text-[#2D0A17] mb-2">Rua *</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => handleInputChange("street", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="Nome da rua"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Número *</label>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Complemento</label>
                      <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => handleInputChange("complement", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="Apto, Bloco, etc"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Bairro *</label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="Bairro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Cidade *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                        placeholder="Cidade"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2D0A17] mb-2">Estado *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                      >
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-200 text-[#6B3A4A] py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-[#E84B6A] text-white py-3 rounded-lg hover:bg-[#C3001A] transition-colors"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[#2D0A17] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
                      Forma de Pagamento
                    </h2>
                    <p className="text-[#6B3A4A] text-sm">
                      Escolha como deseja pagar
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "credit", label: "Cartão de Crédito" },
                      { id: "debit", label: "Cartão de Débito" },
                      { id: "pix", label: "PIX" },
                      { id: "boleto", label: "Boleto" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => handleInputChange("paymentMethod", id)}
                        className={`p-4 border-2 rounded-lg text-sm transition-all ${
                          formData.paymentMethod === id
                            ? "border-[#E84B6A] bg-[#E84B6A]/5 text-[#C3001A]"
                            : "border-gray-200 text-[#6B3A4A] hover:border-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {(formData.paymentMethod === "credit" || formData.paymentMethod === "debit") && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#2D0A17] mb-2">Número do Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#2D0A17] mb-2">Nome no Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                          placeholder="Nome como está no cartão"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#2D0A17] mb-2">Validade *</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                            placeholder="MM/AA"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-[#2D0A17] mb-2">CVV *</label>
                          <input
                            type="text"
                            value={formData.cardCvv}
                            onChange={(e) => handleInputChange("cardCvv", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E84B6A]"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "pix" && (
                    <div className="bg-[#F5D5D9]/30 rounded-lg p-6 text-center">
                      <p className="text-[#2D0A17] mb-2">Após confirmar o pedido, você receberá o QR Code do PIX para pagamento.</p>
                      <p className="text-[#6B3A4A] text-sm">O pedido será processado após a confirmação do pagamento.</p>
                    </div>
                  )}

                  {formData.paymentMethod === "boleto" && (
                    <div className="bg-[#F5D5D9]/30 rounded-lg p-6 text-center">
                      <p className="text-[#2D0A17] mb-2">Após confirmar o pedido, você receberá o boleto por e-mail.</p>
                      <p className="text-[#6B3A4A] text-sm">O pedido será processado após a confirmação do pagamento.</p>
                    </div>
                  )}

                  <div className="bg-[#E84B6A]/5 rounded-lg p-4 flex items-start gap-3 border border-[#E84B6A]/20">
                    <Lock className="w-5 h-5 text-[#E84B6A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#2D0A17] text-sm">Pagamento Seguro</p>
                      <p className="text-[#6B3A4A] text-xs mt-1">
                        Seus dados estão protegidos com criptografia SSL
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-200 text-[#6B3A4A] py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-[#E84B6A] text-white py-3 rounded-lg hover:bg-[#C3001A] transition-colors"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-[#2D0A17] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Resumo do Pedido
              </h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#2D0A17] truncate">{item.name}</p>
                      <p className="text-xs text-[#6B3A4A]">Qtd: {item.quantity}</p>
                      <p className="text-sm text-[#E84B6A]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-[#6B3A4A]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B3A4A]">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Frete
                  </span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-[#2D0A17]">Total</span>
                  <span className="text-xl text-[#E84B6A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#6B3A4A]">
                  <Package className="w-4 h-4 text-[#E84B6A]" />
                  <span>Embalagem discreta</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B3A4A]">
                  <Lock className="w-4 h-4 text-[#E84B6A]" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B3A4A]">
                  <Truck className="w-4 h-4 text-[#E84B6A]" />
                  <span>Entrega em até 7 dias úteis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
