import { Link } from "@tanstack/react-router";
import { Heart, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-display font-black text-lg text-primary text-glow-cyan tracking-wider">
                GEARFORGE
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium gaming hardware crafted for champions. Performance without
              compromise.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                All Products
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground">
              Categories
            </h4>
            <nav className="flex flex-col gap-2">
              {["GPU", "Monitor", "Peripheral", "Headset", "Controller"].map(
                (cat) => (
                  <Link
                    key={cat}
                    to="/products"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} GearForge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with{" "}
            <Heart className="h-3 w-3 text-destructive fill-destructive" />{" "}
            using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
