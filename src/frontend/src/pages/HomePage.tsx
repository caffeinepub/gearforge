import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Cpu,
  Gamepad2,
  Headphones,
  Monitor,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { useGetProducts } from "../hooks/useQueries";

// Static featured products for first-load experience
const STATIC_FEATURED: Product[] = [
  {
    id: BigInt(1),
    name: "NVIDIA RTX 4090 Ti Founders Edition",
    category: "GPU",
    price: 1599.99,
    description:
      "The ultimate gaming GPU featuring Ada Lovelace architecture with 24GB GDDR6X memory. Dominate 4K gaming and content creation.",
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
    name: 'GearForge Apex 27" QHD 240Hz Monitor',
    category: "Monitor",
    price: 649.99,
    description:
      "IPS Nano panel with 2560x1440 resolution at a blazing 240Hz refresh rate. Zero blur, zero compromise.",
    specs: [
      ["Resolution", "2560x1440 QHD"],
      ["Refresh Rate", "240Hz"],
      ["Response Time", "0.5ms GtG"],
      ["Panel Type", "IPS Nano"],
    ],
    inStock: true,
  },
  {
    id: BigInt(3),
    name: "TactilePro X MK Ultra Keyboard",
    category: "Peripheral",
    price: 179.99,
    description:
      "Hall-effect magnetic switches, 8000Hz polling rate, and per-key RGB illumination in a no-compromise 75% layout.",
    specs: [
      ["Switch Type", "Magnetic Hall-Effect"],
      ["Polling Rate", "8000 Hz"],
      ["Layout", "75%"],
      ["Connectivity", "USB-C / 2.4 GHz"],
    ],
    inStock: true,
  },
  {
    id: BigInt(4),
    name: "SonicEdge Pro Wireless Headset",
    category: "Headset",
    price: 249.99,
    description:
      "Planar magnetic drivers with 7.1 surround simulation. Ultra-low 2.4 GHz wireless with 40-hour battery life.",
    specs: [
      ["Driver Type", "Planar Magnetic"],
      ["Frequency Response", "10 Hz – 40 kHz"],
      ["Battery Life", "40 Hours"],
      ["Connection", "2.4 GHz / Bluetooth 5.2"],
    ],
    inStock: true,
  },
];

const features = [
  {
    icon: Zap,
    title: "Top-Tier Performance",
    description:
      "Only the finest components make it onto our shelves. No compromises.",
  },
  {
    icon: Shield,
    title: "3-Year Warranty",
    description:
      "Every product backed by a comprehensive warranty and 24/7 support.",
  },
  {
    icon: Cpu,
    title: "Cutting-Edge Tech",
    description:
      "Always stocked with the latest hardware the industry has to offer.",
  },
];

const categoryHighlights = [
  { label: "GPUs", icon: Cpu, color: "text-primary", bg: "bg-primary/10" },
  {
    label: "Monitors",
    icon: Monitor,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Peripherals",
    icon: Zap,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    label: "Headsets",
    icon: Headphones,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    label: "Controllers",
    icon: Gamepad2,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products = [] } = useGetProducts();

  // Use real products if loaded, otherwise use static ones
  const featuredProducts =
    products.length >= 4 ? products.slice(0, 4) : STATIC_FEATURED;

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1600x700.jpg')",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* Scanlines */}
        <div className="absolute inset-0 scanline-overlay opacity-50" />

        {/* Cyan accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border border-primary/30 font-mono-code text-xs uppercase tracking-widest">
                <Zap className="h-3 w-3 mr-1.5" />
                New Season Drop — Spring 2026
              </Badge>

              <h1 className="font-display font-black text-5xl md:text-7xl text-foreground leading-[0.95] tracking-tight mb-6">
                <span className="block">Next-Level</span>
                <span className="block text-primary text-glow-cyan">
                  Gaming
                </span>
                <span className="block">Hardware</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                Explore top-tier GPUs, monitors, peripherals and more —{" "}
                <span className="text-foreground font-semibold">
                  built for champions.
                </span>
              </p>

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 font-display font-black text-base tracking-wider px-8 hover:shadow-glow-cyan transition-all"
                  onClick={() => navigate({ to: "/products" })}
                  data-ocid="hero.primary_button"
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-semibold"
                  onClick={() => {
                    document
                      .getElementById("featured")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Featured
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-border/50"
            >
              {[
                { label: "Products", value: "500+" },
                { label: "Brands", value: "50+" },
                { label: "Customers", value: "120K+" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono-code font-black text-2xl text-primary text-glow-cyan">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Category Highlights ────────────────────────────────────────────── */}
      <section className="py-10 border-y border-border bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide pb-1">
            {categoryHighlights.map(({ label, icon: Icon, color, bg }) => (
              <button
                type="button"
                key={label}
                onClick={() => navigate({ to: "/products" })}
                className="flex items-center gap-3 px-5 py-3 rounded-full border border-border hover:border-primary/40 bg-card hover:bg-card/80 transition-all group shrink-0"
              >
                <div className={`p-1.5 rounded-md ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="font-display font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────────────── */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-10 gap-4"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono-code">
                — Featured
              </p>
              <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
                Top Picks
              </h2>
            </div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary cyber-border text-sm font-semibold shrink-0"
              onClick={() => navigate({ to: "/products" })}
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why GearForge ─────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono-code">
              — Why Us
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
              The GearForge Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all group"
              >
                <div className="p-3 rounded-lg bg-primary/10 cyber-border w-fit mb-4 group-hover:shadow-glow-cyan transition-all">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-black text-4xl md:text-5xl text-foreground mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Browse our full catalogue and find the perfect gear for your
              setup.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/80 font-display font-black text-base tracking-wider px-10 hover:shadow-glow-cyan transition-all"
              onClick={() => navigate({ to: "/products" })}
            >
              Explore All Products
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
