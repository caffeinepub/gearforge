import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetCart } from "../hooks/useQueries";
import CartSheet from "./CartSheet";

export default function Navbar() {
  const router = useRouter();
  const location = router.state.location;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { data: cartItems = [] } = useGetCart();

  const totalQty = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/logo-transparent.dim_300x80.png"
              alt="GearForge"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-display font-black text-xl text-primary text-glow-cyan tracking-wider hidden sm:inline">
              GEARFORGE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.link.${i + 1}`}
                className={`px-4 py-2 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10 cyber-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                activeProps={{
                  className: "text-primary bg-primary/10 cyber-border",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={() => setCartOpen(true)}
              data-ocid="cart.open_modal_button"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQty > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 min-w-5 px-1 text-xs bg-primary text-primary-foreground border-0 flex items-center justify-center font-mono-code">
                    {totalQty > 99 ? "99+" : totalQty}
                  </Badge>
                </motion.div>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1"
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.link.${i + 1}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                activeProps={{ className: "text-primary bg-primary/10" }}
              >
                <Zap className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
