import { useCart } from "../contexts/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-[#2D0A17] border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="text-[#F5D5D9] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Meu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <ShoppingBag className="w-16 h-16 text-[#F5D5D9]/30 mb-4" />
              <p className="text-[#F5D5D9]/70 mb-2">Seu carrinho está vazio</p>
              <p className="text-[#F5D5D9]/50 text-sm mb-6">
                Adicione produtos para continuar comprando
              </p>
              <Button
                onClick={onClose}
                className="bg-[#E84B6A] hover:bg-[#E84B6A]/90 text-white"
              >
                Continuar Comprando
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6 -mx-6 px-6">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[#F5D5D9] text-sm mb-1 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[#E84B6A] font-semibold mb-3">
                            {formatPrice(item.price)}
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-1.5 text-[#F5D5D9] hover:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-[#F5D5D9] text-sm w-8 text-center"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-1.5 text-[#F5D5D9] hover:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#F5D5D9]/50 hover:text-[#E84B6A] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-t border-white/10 pt-4 space-y-4"
              >
                <div className="flex justify-between items-center text-[#F5D5D9]">
                  <span className="text-lg">Total</span>
                  <motion.span
                    key={getTotalPrice()}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-semibold text-[#E84B6A]"
                  >
                    {formatPrice(getTotalPrice())}
                  </motion.span>
                </div>

                <Button
                  className="w-full bg-[#E84B6A] hover:bg-[#E84B6A]/90 text-white py-6"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/10 text-[#F5D5D9] hover:bg-white/5"
                  onClick={() => {
                    if (confirm("Deseja limpar o carrinho?")) {
                      clearCart();
                      onClose();
                    }
                  }}
                >
                  Limpar Carrinho
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}