import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@tanstack/react-router";
import { PackageSearch, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { useGetProductsByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "GPU",
  "Monitor",
  "Peripheral",
  "Headset",
  "Controller",
] as const;
type Category = (typeof CATEGORIES)[number];

// Static sample products for initial empty-state prevention
const STATIC_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "NVIDIA RTX 4090 Ti Founders Edition",
    category: "GPU",
    price: 1599.99,
    description:
      "The ultimate gaming GPU with Ada Lovelace architecture, 24GB GDDR6X memory, and DLSS 3.5 support.",
    specs: [
      ["VRAM", "24 GB GDDR6X"],
      ["CUDA Cores", "16384"],
      ["Boost Clock", "2.61 GHz"],
      ["TDP", "450W"],
    ],
    inStock: true,
  },
  {
    id: BigInt(2),
    name: "AMD Radeon RX 7900 XTX OC",
    category: "GPU",
    price: 899.99,
    description:
      "AMD's flagship GPU with RDNA 3 architecture, 24GB GDDR6 memory, and stunning 4K performance.",
    specs: [
      ["VRAM", "24 GB GDDR6"],
      ["Compute Units", "96"],
      ["Boost Clock", "2.5 GHz"],
      ["TDP", "355W"],
    ],
    inStock: true,
  },
  {
    id: BigInt(3),
    name: 'GearForge Apex 27" QHD 240Hz Monitor',
    category: "Monitor",
    price: 649.99,
    description:
      "IPS Nano panel with 2560x1440 resolution at 240Hz, HDR600 certified, and wide color gamut.",
    specs: [
      ["Resolution", "2560x1440"],
      ["Refresh Rate", "240Hz"],
      ["Response Time", "0.5ms"],
      ["Panel", "IPS Nano"],
    ],
    inStock: true,
  },
  {
    id: BigInt(4),
    name: 'UltraView 49" OLED Super Ultrawide',
    category: "Monitor",
    price: 1299.99,
    description:
      "49-inch OLED panel with 5120x1440 resolution, 0.03ms response time, and immersive curved display.",
    specs: [
      ["Resolution", "5120x1440"],
      ["Panel", "OLED"],
      ["Curve", "1000R"],
      ["Refresh Rate", "144Hz"],
    ],
    inStock: false,
  },
  {
    id: BigInt(5),
    name: "TactilePro X MK Ultra Keyboard",
    category: "Peripheral",
    price: 179.99,
    description:
      "Hall-effect magnetic switches with 8000Hz polling rate and per-key RGB in compact 75% layout.",
    specs: [
      ["Switch", "Hall-Effect Magnetic"],
      ["Polling Rate", "8000 Hz"],
      ["Layout", "75%"],
      ["RGB", "Per-Key"],
    ],
    inStock: true,
  },
  {
    id: BigInt(6),
    name: "GlideForce Pro Wireless Mouse",
    category: "Peripheral",
    price: 129.99,
    description:
      "Ultra-lightweight 58g gaming mouse with HERO 25K sensor, 2.4GHz wireless, and 70-hour battery.",
    specs: [
      ["Sensor", "HERO 25K"],
      ["DPI", "100–25,600"],
      ["Weight", "58g"],
      ["Battery", "70 hours"],
    ],
    inStock: true,
  },
  {
    id: BigInt(7),
    name: "SonicEdge Pro Wireless Headset",
    category: "Headset",
    price: 249.99,
    description:
      "Planar magnetic drivers with 7.1 surround simulation, 2.4GHz wireless, and 40-hour battery.",
    specs: [
      ["Driver", "Planar Magnetic"],
      ["Frequency", "10 Hz–40 kHz"],
      ["Battery", "40 Hours"],
      ["Connection", "2.4 GHz"],
    ],
    inStock: true,
  },
  {
    id: BigInt(8),
    name: "ZeroLatency Air Headset",
    category: "Headset",
    price: 149.99,
    description:
      "40mm neodymium drivers with active noise cancellation, RGB accents, and detachable boom mic.",
    specs: [
      ["Driver", "40mm Neodymium"],
      ["ANC", "Yes"],
      ["Battery", "25 Hours"],
      ["Connection", "Bluetooth 5.3"],
    ],
    inStock: true,
  },
  {
    id: BigInt(9),
    name: "HapticForce X Pro Controller",
    category: "Controller",
    price: 89.99,
    description:
      "Hall-effect analog sticks, dual-zone haptic feedback, adaptive triggers, and 20-hour battery.",
    specs: [
      ["Sticks", "Hall-Effect"],
      ["Haptics", "Dual-Zone"],
      ["Battery", "20 Hours"],
      ["Platform", "PC / Console"],
    ],
    inStock: true,
  },
  {
    id: BigInt(10),
    name: "StreetFighter Elite Arcade Pad",
    category: "Controller",
    price: 199.99,
    description:
      "Tournament-grade leverless arcade controller with Sanwa mechanical buttons and swappable layouts.",
    specs: [
      ["Buttons", "Sanwa Mechanical"],
      ["Connection", "USB-C / 2.4 GHz"],
      ["Layout", "Leverless"],
      ["Polling", "1000 Hz"],
    ],
    inStock: false,
  },
];

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full bg-secondary/50" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20 bg-secondary/50" />
        <Skeleton className="h-5 w-3/4 bg-secondary/50" />
        <Skeleton className="h-4 w-full bg-secondary/50" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-24 bg-secondary/50" />
          <Skeleton className="h-8 w-28 bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();

  // Read category from URL search params
  const searchParams = new URLSearchParams(router.state.location.search);
  const initialCat = (searchParams.get("category") as Category) ?? "All";
  const [activeCategory, setActiveCategory] = useState<Category>(
    CATEGORIES.includes(initialCat as Category)
      ? (initialCat as Category)
      : "All",
  );

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsByCategory(activeCategory);

  // Sync from URL when navigating via category highlights on home page
  useEffect(() => {
    const params = new URLSearchParams(router.state.location.search);
    const cat = params.get("category") as Category;
    if (cat && CATEGORIES.includes(cat as Category)) {
      setActiveCategory(cat as Category);
    }
  }, [router.state.location.search]);

  const handleCategoryChange = (value: string) => {
    const cat = value as Category;
    setActiveCategory(cat);
  };

  // Fall back to filtered static products if backend hasn't loaded
  const displayProducts: Product[] =
    !isLoading && products !== undefined && products.length > 0
      ? products
      : isLoading
        ? []
        : STATIC_PRODUCTS.filter(
            (p) => activeCategory === "All" || p.category === activeCategory,
          );

  const showLoading = isLoading;
  const showEmpty = !isLoading && displayProducts.length === 0 && !isError;

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono-code">
            — Catalogue
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display font-black text-4xl md:text-5xl text-foreground">
              All Products
            </h1>
            {!isLoading && displayProducts.length > 0 && (
              <Badge className="bg-primary/10 text-primary border border-primary/30 font-mono-code text-sm shrink-0">
                <Zap className="h-3 w-3 mr-1.5" />
                {displayProducts.length} item
                {displayProducts.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Category tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={handleCategoryChange}
          className="mb-8"
        >
          <TabsList
            className="flex flex-wrap h-auto gap-1 bg-secondary/30 border border-border p-1.5 rounded-lg w-full sm:w-auto"
            data-ocid="products.tab"
          >
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-cyan px-4 py-2 rounded-md transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Error state */}
        {isError && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="products.error_state"
          >
            <div className="p-4 rounded-full bg-destructive/10 border border-destructive/30">
              <PackageSearch className="h-10 w-10 text-destructive" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">
              Failed to load products
            </p>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page.
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {showLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            data-ocid="products.loading_state"
          >
            {Array.from({ length: 8 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable identity
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {showEmpty && !isError && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4"
            data-ocid="products.empty_state"
          >
            <div className="p-4 rounded-full bg-primary/10 cyber-border">
              <PackageSearch className="h-10 w-10 text-primary" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">
              No products in {activeCategory}
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon — new gear drops frequently.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!showLoading && displayProducts.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              data-ocid="products.list"
            >
              {displayProducts.map((product, index) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
