import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useClearCart,
  useGetCart,
  useGetProducts,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks/useQueries";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { data: cartItems = [], isLoading: cartLoading } = useGetCart();
  const { data: products = [] } = useGetProducts();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const clearCart = useClearCart();
  const [clearingCart, setClearingCart] = useState(false);

  // Build enriched cart items
  const enrichedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<{
    productId: bigint;
    quantity: bigint;
    product: {
      id: bigint;
      name: string;
      price: number;
      category: string;
      inStock: boolean;
    };
  }>;

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * Number(item.quantity),
    0,
  );

  const handleRemove = (productId: bigint) => {
    removeFromCart.mutate(productId, {
      onError: () => toast.error("Failed to remove item"),
    });
  };

  const handleQtyChange = (
    productId: bigint,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    updateQuantity.mutate(
      { productId, quantity: BigInt(newQty) },
      { onError: () => toast.error("Failed to update quantity") },
    );
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    clearCart.mutate(undefined, {
      onSuccess: () => {
        toast.success("Cart cleared");
        setClearingCart(false);
      },
      onError: () => {
        toast.error("Failed to clear cart");
        setClearingCart(false);
      },
    });
  };

  const handleCheckout = () => {
    toast.info("Checkout coming soon!", {
      description: "We're working on secure payment integration.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col bg-card border-border p-0"
        data-ocid="cart.sheet"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-3 font-display text-xl text-foreground">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart
            {enrichedItems.length > 0 && (
              <Badge className="ml-auto bg-primary/10 text-primary border border-primary/30 font-mono-code">
                {enrichedItems.length} item
                {enrichedItems.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Content */}
        {cartLoading ? (
          <div
            className="flex-1 flex items-center justify-center"
            data-ocid="cart.loading_state"
          >
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm">Loading cart...</span>
            </div>
          </div>
        ) : enrichedItems.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center"
            data-ocid="cart.empty_state"
          >
            <div className="p-6 rounded-full bg-secondary/50 cyber-border">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-foreground">
                Cart is empty
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some gear to get started
              </p>
            </div>
            <Button
              variant="outline"
              className="cyber-border text-primary hover:bg-primary/10"
              onClick={() => onOpenChange(false)}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-3" data-ocid="cart.list">
                <AnimatePresence initial={false}>
                  {enrichedItems.map((item, index) => (
                    <motion.div
                      key={item.productId.toString()}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      data-ocid={`cart.item.${index + 1}`}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-bold text-primary mt-1 font-mono-code">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          onClick={() =>
                            handleQtyChange(
                              item.productId,
                              Number(item.quantity),
                              -1,
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-mono-code font-bold text-foreground">
                          {Number(item.quantity)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          onClick={() =>
                            handleQtyChange(
                              item.productId,
                              Number(item.quantity),
                              1,
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(item.productId)}
                        data-ocid="cart.delete_button"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-display font-black text-xl text-primary font-mono-code text-glow-cyan">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold tracking-wider glow-cyan transition-all"
                  onClick={handleCheckout}
                  data-ocid="cart.submit_button"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive text-sm"
                  onClick={handleClearCart}
                  disabled={clearingCart}
                  data-ocid="cart.delete_button"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {clearingCart ? "Clearing..." : "Clear Cart"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
