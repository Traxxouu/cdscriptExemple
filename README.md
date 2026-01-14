# 🚀 ScriptShop - Boutique de Scripts Premium

Une boutique moderne pour vendre des scripts avec paiement unique ou abonnement mensuel.

## Stack Technique

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: Supabase (PostgreSQL)
- **Paiements**: Stripe (one-time + subscriptions)
- **Auth**: Supabase Auth (Discord OAuth)

## Installation

### 1. Cloner et installer les dépendances

```bash
cd script-shop
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le contenu de `supabase-schema.sql`
3. Configurer Discord OAuth:
   - **Authentication > Providers > Discord**
   - Ajouter ton Client ID et Secret depuis [Discord Developer Portal](https://discord.com/developers/applications)
4. Configurer les URLs de redirection:
   - **Authentication > URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Configurer Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API dans **Developers > API keys**
3. Configurer le webhook:
   - **Developers > Webhooks > Add endpoint**
   - URL: `https://ton-domaine.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 4. Variables d'environnement

Remplis le fichier `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
script-shop/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Styles globaux
│   ├── shop/               # Page boutique
│   ├── product/[id]/       # Page produit
│   ├── checkout/success/   # Page succès paiement
│   ├── dashboard/          # Dashboard utilisateur
│   ├── auth/callback/      # Callback OAuth
│   └── api/
│       ├── checkout/       # API paiement unique
│       ├── subscription/   # API abonnement
│       └── webhook/        # Webhook Stripe
├── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts        # Client Supabase
│   └── stripe.ts          # Client Stripe
├── types/
│   └── index.ts           # Types TypeScript
└── supabase-schema.sql    # Schema SQL
```

## Ajouter un produit

1. Va dans ton dashboard Supabase
2. **Table Editor > products**
3. Clique sur **Insert row**
4. Remplis les champs:
   - `name`: Nom du script
   - `description`: Description complète
   - `short_description`: Description courte (pour les cartes)
   - `price`: Prix achat unique (ex: 29.99)
   - `monthly_price`: Prix abonnement mensuel (optionnel, ex: 4.99)
   - `category`: Catégorie (ex: FiveM, Discord, Web)
   - `features`: JSON array des features `["Feature 1", "Feature 2"]`
   - `file_url`: Lien de téléchargement du script
   - `doc_url`: Lien documentation (optionnel)

## Tester les paiements

En mode test Stripe, utilise ces cartes:
- ✅ **Succès**: `4242 4242 4242 4242`
- ❌ **Refusé**: `4000 0000 0000 0002`
- 🔄 **Auth requise**: `4000 0025 0000 3155`

Date d'expiration: n'importe quelle date future
CVC: n'importe quel nombre à 3 chiffres

## Déploiement

### Vercel (recommandé)

1. Push le projet sur GitHub
2. Importe sur [vercel.com](https://vercel.com)
3. Ajoute les variables d'environnement
4. Mets à jour `NEXT_PUBLIC_APP_URL` avec ton domaine Vercel
5. Configure le webhook Stripe avec l'URL de production

## Support

Des questions ? Rejoins le Discord ou ouvre une issue sur GitHub.

---
Fait par mael barbe (YourWeb) le 12/01/2026
