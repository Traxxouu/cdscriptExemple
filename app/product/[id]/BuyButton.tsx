'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight } from 'lucide-react';

interface BuyButtonProps {
  productId: string;
  type: 'one_time' | 'subscription';
}

export default function BuyButton({ productId, type }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/product/${productId}`,
          },
        });
        return;
      }

      const endpoint = type === 'subscription' ? '/api/subscription' : '/api/checkout';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId,
          userId: user.id,
          email: user.email 
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur lors du paiement. Réessaie plus tard.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          {type === 'subscription' ? "S'abonner" : 'Acheter maintenant'}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
