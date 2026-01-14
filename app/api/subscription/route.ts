import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, email } = await req.json();
    const supabaseAdmin = getSupabaseAdmin();

    if (!productId || !userId || !email) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Get product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product || !product.monthly_price) {
      return NextResponse.json(
        { error: 'Produit non trouvé ou abonnement non disponible' },
        { status: 404 }
      );
    }

    // Get or create user in our database
    let { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = existingUser?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Upsert user with Stripe customer ID
      await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          email: email,
          stripe_customer_id: customerId,
        });
    }

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${product.name} - Abonnement`,
              description: `Accès mensuel + mises à jour`,
            },
            unit_amount: Math.round(product.monthly_price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
        userId: userId,
        type: 'subscription',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${productId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
