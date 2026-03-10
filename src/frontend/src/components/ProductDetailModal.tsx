import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ShoppingCart, X, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useAddToCart } from "../hooks/useQueries";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryImages: Record<string, string> = {
  GPU: "/assets/generated/gpu-hero.dim_800x500.jpg",
  Monitor: "/assets/generated/monitor-product.dim_600x400.jpg",
  Peripheral: "/assets/generated/keyboard-product.dim_600x400.jpg",
  Headset: "/assets/generated/headset-product.dim_600x400.jpg",
  Controller: "/assets/generated/controller-product.dim_600x400.jpg",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const categoryColors: Record<string, string> = {
  GPU: "bg-primary/10 text-primary border-primary/30",
  Monitor: "bg-accent/10 text-accent border-accent/30",
  Peripheral: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  Headset: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  Controller: "bg-chart-5/10 text-chart-5 border-chart-5/30",
};

export default function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  const addToCart = useAddToCart();

  if (!product) return null;

  const imgSrc = categoryImages[product.category] ?? categoryImages.GPU;
  const badgeClass =
    categoryColors[product.category] ??
    "bg-muted text-muted-foreground border-border";

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart.mutate(
      { productId: product.id, quantity: BigInt(1) },
      {
        onSuccess: () => {
          toast.success(`${product.name} added to cart`);
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to add to cart"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full bg-card border-border p-0 gap-0 overflow-hidden"
        data-ocid="product.dialog"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          data-ocid="product.close_button"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <ScrollArea className="max-h-[85vh]">
          {/* Product image */}
          <div className="relative aspect-video w-full overflow-hidden bg-secondary/30">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <Badge
                className={`text-xs font-bold uppercase tracking-widest border ${badgeClass}`}
              >
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <DialogHeader className="space-y-2">
              <DialogTitle className="font-display font-black text-2xl text-foreground leading-tight">
                {product.name}
              </DialogTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {product.description}
              </p>
            </DialogHeader>

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">
                  Specifications
                </h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableBody>
                      {product.specs.map(([key, value]) => (
                        <TableRow
                          key={key}
                          className="border-border hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-semibold text-xs text-muted-foreground uppercase tracking-wide w-2/5 py-2.5">
                            {key}
                          </TableCell>
                          <TableCell className="text-sm text-foreground font-mono-code py-2.5">
                            {value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Price
                </p>
                <p className="font-mono-code font-black text-3xl text-primary text-glow-cyan">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <span className="flex items-center gap-1.5 text-xs text-chart-3 font-semibold">
                    <Zap className="h-3 w-3" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-semibold">
                    Out of Stock
                  </span>
                )}
                <Button
                  className={`font-display font-bold tracking-wider transition-all ${
                    product.inStock
                      ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-glow-cyan"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCart.isPending}
                  data-ocid="product.submit_button"
                >
                  {addToCart.isPending ? (
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
