'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Check, RefreshCw, Shield, Download, Loader2, ArrowLeft, Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import BuyButton from './BuyButton';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    // Trigger animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Script non trouvé</h1>
          <p className="text-gray-600 mb-8">Ce script n&apos;existe pas ou a été supprimé.</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Image */}
          <div className="fade-in-left">
            <div className="glass-card rounded-[2rem] p-12 flex items-center justify-center min-h-[500px] sticky top-32">
              <div className="text-center">
                <span className="text-[150px] block mb-6">🚀</span>
                <span className="badge badge-primary text-base px-4 py-2">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Info */}
          <div className="fade-in-right">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">4.9</span>
                <span className="text-gray-400">(128 avis)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>500+ ventes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Mis à jour récemment</span>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Fonctionnalités incluses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 bg-white/60 rounded-xl p-4 border border-gray-100"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div id="buy" className="glass-card rounded-3xl p-8 mb-8">
              <h3 className="text-lg font-semibold mb-6">Choisir une option</h3>
              
              <div className="space-y-4">
                {/* One-time Purchase */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Download className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Achat unique</h4>
                        <p className="text-sm text-gray-500">Accès à vie</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold">{product.price}€</p>
                  </div>
                  <BuyButton productId={product.id} type="one_time" />
                </div>

                {/* Subscription */}
                {product.monthly_price && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary">
                        <Star className="w-3 h-3 mr-1" />
                        Recommandé
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Abonnement</h4>
                          <p className="text-sm text-gray-500">Mises à jour incluses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{product.monthly_price}€</p>
                        <p className="text-sm text-gray-500">/mois</p>
                      </div>
                    </div>
                    <BuyButton productId={product.id} type="subscription" />
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                Support 7j/7
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-500" />
                Téléchargement instant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
