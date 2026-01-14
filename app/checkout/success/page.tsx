import Link from 'next/link';
import { CheckCircle, Download, ArrowRight, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-20 px-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="relative max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Paiement réussi !
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Merci pour ton achat ! Tu peux maintenant accéder à ton script depuis ton dashboard.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/dashboard" 
            className="btn-primary flex items-center justify-center gap-2 text-lg"
          >
            <Download className="w-5 h-5" />
            Accéder au dashboard
          </Link>
          <Link 
            href="/shop" 
            className="text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-2 font-medium"
          >
            Continuer les achats
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Confetti effect - simple version */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
