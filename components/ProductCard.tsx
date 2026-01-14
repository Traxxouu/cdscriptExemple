'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card-glow rounded-2xl overflow-hidden group">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="text-6xl">🚀</div>
        <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.short_description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold gradient-text">{product.price}€</span>
            {product.monthly_price && (
              <span className="text-gray-500 text-sm ml-2">
                ou {product.monthly_price}€/mois
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link 
            href={`/product/${product.id}`}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-2.5 rounded-xl transition-all font-medium"
          >
            Détails
          </Link>
          <Link 
            href={`/product/${product.id}#buy`}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Acheter
          </Link>
        </div>
      </div>
    </div>
  );
}
