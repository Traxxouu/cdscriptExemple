'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { User, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const supabase = getSupabase();
    
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSignIn = async () => {
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 navbar ${
        isVisible ? 'navbar-visible' : 'navbar-hidden'
      } ${isScrolled ? 'navbar-scrolled' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CDScript</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/shop" 
              className="text-gray-600 hover:text-black transition-colors font-medium"
            >
              Explorer
            </Link>
            <Link 
              href="/trending" 
              className="text-gray-600 hover:text-black transition-colors font-medium"
            >
              Tendances
            </Link>
            <Link 
              href="/sell" 
              className="text-gray-600 hover:text-black transition-colors font-medium"
            >
              Vendre
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSignIn}
                  className="text-gray-600 hover:text-black transition-colors font-medium"
                >
                  Connexion
                </button>
                <button 
                  onClick={handleSignIn}
                  className="btn-primary !py-3 !px-6"
                >
                  Commencer
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link 
                href="/shop" 
                className="text-gray-600 hover:text-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Explorer
              </Link>
              <Link 
                href="/trending" 
                className="text-gray-600 hover:text-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Tendances
              </Link>
              <Link 
                href="/sell" 
                className="text-gray-600 hover:text-black font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Vendre
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-black font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }} 
                    className="text-red-500 font-medium py-2 text-left"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSignIn} 
                  className="btn-primary w-full mt-2"
                >
                  Commencer gratuitement
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
