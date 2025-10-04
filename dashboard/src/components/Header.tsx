"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth(); // Get the authentication state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-cyan-600" />
            <span className="font-bold text-xl text-gray-900">Samudra Prahari</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['home', 'how-it-works', 'features'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium capitalize"
              >
                {item.replace('-', ' ')}
              </button>
            ))}
            
            {/* ====== MODIFICATION START ====== */}
            {isAuthenticated ? (
              <a href="/u/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Dashboard
              </a>
            ) : (
              <a href="/signin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Signin
              </a>
            )}
            {/* ====== MODIFICATION END ====== */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation (Unchanged from your original code) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="px-4 py-4 space-y-2">
              {['home', 'how-it-works', 'features', 'team-tech', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium capitalize"
                >
                  {item.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;