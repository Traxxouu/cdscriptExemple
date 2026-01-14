import Link from 'next/link';
import { Sparkles, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">CDScript</span>
            </Link>
            <p className="text-gray-600 mb-6">
              La marketplace #1 pour acheter et vendre des scripts premium.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@cdscript.fr" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-black mb-6">Navigation</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-black transition-colors">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-black transition-colors">
                  Tendances
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-black transition-colors">
                  Vendre
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-black mb-6">Ressources</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link href="/help" className="hover:text-black transition-colors">
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-black transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-black transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-black transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-black mb-6">Légal</h4>
            <ul className="space-y-4 text-gray-600">
              <li>
                <Link href="/cgv" className="hover:text-black transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-black transition-colors">
                  Remboursement
                </Link>
              </li>
              <li>
                <Link href="/mentions" className="hover:text-black transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CDScript. Tous droits réservés.
          </p>
          <p className="text-gray-400 text-sm">
            Fait avec ❤️ en France
          </p>
        </div>
      </div>
    </footer>
  );
}
