'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, TrendingUp, Shield, Zap, Users, Star, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularScripts, setPopularScripts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const scriptsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Fetch popular scripts
    async function fetchPopularScripts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (data) setPopularScripts(data);
    }
    
    fetchPopularScripts();
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [popularScripts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Hero Section - Full Screen */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
      >
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">
              +2,500 scripts disponibles
            </span>
          </div>

          {/* Main Title */}
          <h1 
            className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="gradient-text">CDScript</span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            La marketplace #1 pour acheter et vendre des scripts premium.
            <span className="text-black font-medium"> Rejoins des milliers de créateurs.</span>
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className={`transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="search-bar flex items-center gap-4 max-w-2xl mx-auto rounded-2xl p-2 shadow-xl">
              <div className="flex-1 flex items-center gap-3 pl-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un script... (FiveM, Discord, Web...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder-gray-400"
                />
              </div>
              <button 
                type="submit"
                className="btn-primary flex items-center gap-2 !rounded-xl"
              >
                Rechercher
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div 
            className={`flex flex-wrap justify-center gap-3 mt-8 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-sm text-gray-500">Populaire:</span>
            {['FiveM', 'Discord Bot', 'React', 'API', 'Dashboard'].map((tag) => (
              <Link
                key={tag}
                href={`/shop?q=${tag}`}
                className="text-sm text-gray-600 hover:text-black bg-white/60 hover:bg-white px-3 py-1 rounded-full transition-all border border-gray-200 hover:border-gray-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-sm">Découvrir</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Popular Scripts Section */}
      <section ref={scriptsRef} className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="fade-in-up">
                <span className="badge badge-hot mb-4">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </span>
              </div>
              <h2 className="fade-in-up delay-100 text-4xl md:text-6xl font-bold tracking-tight">
                Scripts populaires
              </h2>
              <p className="fade-in-up delay-200 text-gray-600 text-lg mt-4 max-w-xl">
                Les scripts les plus téléchargés par notre communauté cette semaine.
              </p>
            </div>
            <Link 
              href="/shop" 
              className="fade-in-up delay-300 inline-flex items-center gap-2 text-black font-medium hover:gap-4 transition-all mt-6 md:mt-0"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Scripts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularScripts.length > 0 ? (
              popularScripts.map((script, index) => (
                <Link 
                  key={script.id} 
                  href={`/product/${script.id}`}
                  className={`fade-in-up delay-${(index + 1) * 100} product-card rounded-3xl overflow-hidden group`}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">🚀</span>
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-primary">{script.category}</span>
                    </div>
                    {index < 3 && (
                      <div className="absolute top-4 right-4">
                        <span className="badge badge-hot">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Top {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                      {script.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {script.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">{script.price}€</span>
                        {script.monthly_price && (
                          <span className="text-gray-400 text-sm ml-2">
                            ou {script.monthly_price}€/mois
                          </span>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Placeholder cards
              [1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`fade-in-up delay-${i * 100} product-card rounded-3xl overflow-hidden`}
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl">✨</span>
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="fade-in-up text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Pourquoi <span className="gradient-text">CDScript</span> ?
            </h2>
            <p className="fade-in-up delay-100 text-gray-600 text-xl max-w-2xl mx-auto">
              Une plateforme conçue pour les créateurs et les acheteurs exigeants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in-up delay-100 glass-card rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Sécurisé</h3>
              <p className="text-gray-600">
                Paiements sécurisés via Stripe. Protection acheteur incluse sur toutes les transactions.
              </p>
            </div>

            <div className="fade-in-up delay-200 glass-card rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Téléchargement Instant</h3>
              <p className="text-gray-600">
                Accède à tes achats immédiatement. Pas d&apos;attente, pas de complications.
              </p>
            </div>

            <div className="fade-in-up delay-300 glass-card rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Communauté Active</h3>
              <p className="text-gray-600">
                Rejoins une communauté de créateurs passionnés. Support et entraide garantis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="scale-in glass-card rounded-[3rem] p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-5xl md:text-7xl font-bold gradient-text mb-2">2.5K+</p>
                <p className="text-gray-600 font-medium">Scripts</p>
              </div>
              <div>
                <p className="text-5xl md:text-7xl font-bold gradient-text mb-2">15K+</p>
                <p className="text-gray-600 font-medium">Utilisateurs</p>
              </div>
              <div>
                <p className="text-5xl md:text-7xl font-bold gradient-text mb-2">50K+</p>
                <p className="text-gray-600 font-medium">Téléchargements</p>
              </div>
              <div>
                <p className="text-5xl md:text-7xl font-bold gradient-text mb-2">4.9</p>
                <p className="text-gray-600 font-medium">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              Prêt à vendre
              <br />
              <span className="gradient-text-warm">tes propres scripts ?</span>
            </h2>
          </div>
          <p className="fade-in-up delay-100 text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Crée ton compte gratuitement et commence à monétiser tes créations dès aujourd&apos;hui.
          </p>
          <div className="fade-in-up delay-200 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell" className="btn-primary text-lg">
              Commencer à vendre
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/shop" className="btn-secondary text-lg">
              Explorer la boutique
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
