'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Search, Filter, Loader2, ChevronRight, X } from 'lucide-react';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const categories = ['all'].concat(Array.from(new Set(products.map(p => p.category))));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.short_description.toLowerCase().includes(search.toLowerCase()) ||
                          product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Explorer les <span className="gradient-text">scripts</span>
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Découvre notre collection de scripts premium créés par des développeurs talentueux.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 search-bar flex items-center gap-4 rounded-2xl p-2">
              <div className="flex-1 flex items-center gap-3 pl-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un script..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder-gray-400"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all font-medium ${
                showFilters || category !== 'all' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtres
              {category !== 'all' && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 glass-card rounded-2xl p-6">
              <p className="text-sm font-medium text-gray-500 mb-4">Catégories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="text-gray-500">
            {filteredProducts.length} script{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            {search && ` pour "${search}"`}
            {category !== 'all' && ` dans ${category}`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="fade-in-up product-card rounded-3xl overflow-hidden group"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🚀</span>
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-primary">{product.category}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {product.short_description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">{product.price}€</span>
                      {product.monthly_price && (
                        <span className="text-gray-400 text-sm ml-2">
                          ou {product.monthly_price}€/mois
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Aucun script trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essaie avec d&apos;autres mots-clés ou explore toutes les catégories.
            </p>
            <button 
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
              className="btn-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
