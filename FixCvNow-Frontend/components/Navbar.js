// this is components/Navbar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { COLORS } from "@/lib/colors";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClose = () => setIsMenuOpen(false);
  const handleLogoClick = () => {
    router.push('/');
    handleMenuClose();
  };
  const handleNavigateToSection = (section) => {
    router.push(`/#${section}`);
    handleMenuClose();
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b"
      style={{ borderColor: COLORS.border }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="/assets/logo.png"
            alt="FixCVNow Logo"
            className="h-12 mr-2"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigateToSection("how-it-works")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            How it Works
          </button>
          <button
            onClick={() => handleNavigateToSection("pricing")}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Pricing
          </button>
          <button
            onClick={() => router.push('/about')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            About Us
          </button>
          <button
            onClick={() => router.push('/faq')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            FAQ
          </button>
          
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg">
          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/"
              onClick={handleMenuClose}
              className="py-2 font-medium hover:opacity-70"
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              onClick={handleMenuClose}
              className="py-2 font-medium hover:opacity-70"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              onClick={handleMenuClose}
              className="py-2 font-medium hover:opacity-70"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={handleMenuClose}
              className="py-2 font-medium hover:opacity-70"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              onClick={handleMenuClose}
              className="py-2 font-medium hover:opacity-70"
            >
              FAQ
            </Link>
            
          </div>
        </div>
      )}
    </nav>
  );
}
