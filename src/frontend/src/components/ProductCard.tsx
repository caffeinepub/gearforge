import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useAddToCart } from "../hooks/useQueries";
import ProductDetailModal from "./ProductDetailModal";

interface ProductCardProps {
  product: Product;
  index: number;
}

const categoryImages: Record<string, string> = {
  GPU: "/assets/generated/gpu-hero.dim_800x500.jpg",
  Monitor: "/assets/generated/monitor-product.dim_600x400.jpg",
  Peripheral: "/assets/generated/keyboard-product.dim_600x400.jpg",
  Headset: "/assets/generated/headset-product.dim_600x400.jpg",
  Controller: "/assets/generated/controller-product.dim_600x400.jpg",
};

// Alternate mouse image for odd-indexed peripherals
const getProductImage = (product: Product, index: number): string => {
  if (product.category === "Peripheral" && index % 2 === 1) {
    return "/assets/generated/mouse-product.dim_600x400.jpg";
  }
  return (
    categoryImages[product.category] ??
    "/assets/generated/gpu-hero.dim_800x500.jpg"
  );
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

export default function ProductCard({ product, index }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart.mutate(
      { productId: product.id, quantity: BigInt(1) },
      {
        onSuccess: () => {
          toast.success(`${product.name} added to cart`, {
            description: "View your cart to checkout",
          });
        },
        onError: () => toast.error("Failed to add to cart"),
      },
    );
  };

  const imgSrc = getProductImage(product, index);
  const badgeClass =
    categoryColors[product.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        whileHover={{ y: -4 }}
        data-ocid={`product.card.${index + 1}`}
        onClick={() => setModalOpen(true)}
        className="group relative flex flex-col bg-card rounded-lg border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
          <img
            src={imgSrc}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 text-foreground text-sm font-semibold">
              <Eye className="h-4 w-4" />
              View Details
            </div>
          </div>
          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Badge
                variant="secondary"
                className="text-xs font-bold uppercase tracking-widest"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-start justify-between gap-2">
            <Badge
              className={`text-xs font-bold uppercase tracking-widest border shrink-0 ${badgeClass}`}
            >
              {product.category}
            </Badge>
            {product.inStock && (
              <span className="flex items-center gap-1 text-xs text-chart-3 font-semibold">
                <Zap className="h-2.5 w-2.5" />
                In Stock
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-base text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="font-mono-code font-black text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              className={`shrink-0 font-bold text-xs tracking-wide transition-all ${
                product.inStock
                  ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-glow-cyan"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleAddToCart}
              disabled={!product.inStock || addToCart.isPending}
              data-ocid={`product.add_button.${index + 1}`}
            >
              {addToCart.isPending ? (
                <div className="h-3 w-3 rounded-full border border-t-transparent animate-spin mr-1" />
              ) : (
                <ShoppingCart className="h-3 w-3 mr-1.5" />
              )}
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>
        </div>
      </motion.div>

      <ProductDetailModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
