'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Purchase } from '@/types';
import { Download, ExternalLink, Calendar, Package, Loader2, User, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      setUser(user);

      const { data: purchasesData, error } = await supabase
        .from('purchases')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching purchases:', error);
      } else {
        setPurchases(purchasesData || []);
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

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
  }, [purchases]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subscriptions = purchases.filter(p => p.type === 'subscription');

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Salut, <span className="gradient-text">{user.email?.split('@')[0]}</span> 👋
            </h1>
            <p className="text-gray-600 text-lg">Retrouve tous tes scripts et téléchargements.</p>
          </div>
          <Link 
            href="/settings" 
            className="mt-4 md:mt-0 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="fade-in-up glass-card rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Package className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Scripts actifs</p>
                <p className="text-4xl font-bold">{purchases.length}</p>
              </div>
            </div>
          </div>
          
          <div className="fade-in-up delay-100 glass-card rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <Download className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Téléchargements</p>
                <p className="text-4xl font-bold">∞</p>
              </div>
            </div>
          </div>
          
          <div className="fade-in-up delay-200 glass-card rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Abonnements</p>
                <p className="text-4xl font-bold">{subscriptions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scripts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mes Scripts</h2>
          
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchases.map((purchase, index) => (
                <div 
                  key={purchase.id} 
                  className={`fade-in-up glass-card rounded-3xl p-6 group`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl">
                        🚀
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{purchase.products?.name}</h3>
                        <p className="text-gray-500 text-sm">{purchase.products?.category}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      purchase.type === 'subscription' 
                        ? 'badge-primary' 
                        : 'badge-success'
                    }`}>
                      {purchase.type === 'subscription' ? 'Abo' : 'Achat'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {purchase.products?.short_description}
                  </p>
                  
                  <div className="flex gap-3">
                    <a
                      href={purchase.products?.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </a>
                    {purchase.products?.doc_url && (
                      <a
                        href={purchase.products.doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl transition-all font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Docs
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Aucun script</h3>
              <p className="text-gray-600 mb-8">Tu n&apos;as pas encore acheté de script.</p>
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                Découvrir la boutique
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Account */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Mon Compte</h2>
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="font-bold text-xl">{user.email}</p>
                <p className="text-gray-500">
                  Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
