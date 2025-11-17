"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href?: string;
  target?: '_self' | '_blank';
}

interface CompanyPublicNavigationProps {
  items?: NavigationItem[];
}

export default function CompanyPublicNavigation({ items = [] }: CompanyPublicNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const handleNavClick = (item: NavigationItem) => {
    if (item.href) {
      if (item.href.startsWith('#')) {
        // Scroll to section
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (item.href.startsWith('http')) {
        // External link
        window.open(item.href, item.target || '_blank', 'noopener,noreferrer');
      } else {
        // Internal link
        window.location.href = item.href;
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {items.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => handleNavClick(item)}
            className="text-gray-700 hover:text-primary hover:bg-gray-100"
          >
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden z-50">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {items.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-primary hover:bg-gray-100"
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

