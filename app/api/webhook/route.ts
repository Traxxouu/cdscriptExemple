import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata) {
          console.error('No metadata in session');
          break;
        }

        const { productId, userId, type } = session.metadata;

        // Create purchase record
        const { error: insertError } = await supabaseAdmin
          .from('purchases')
          .insert({
            user_id: userId,
            product_id: productId,
            stripe_session_id: session.id,
            stripe_subscription_id: session.subscription as string || null,
            type: type,
            status: 'active',
          });

        if (insertError) {
          console.error('Error creating purchase:', insertError);
        } else {
          console.log(`Purchase created: user=${userId}, product=${productId}, type=${type}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const status = subscription.status === 'active' ? 'active' : 'expired';
        
        await supabaseAdmin
          .from('purchases')
          .update({ status })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`Subscription ${subscription.id} updated to ${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from('purchases')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`Subscription ${subscription.id} cancelled`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          await supabaseAdmin
            .from('purchases')
            .update({ status: 'expired' })
            .eq('stripe_subscription_id', invoice.subscription as string);

          console.log(`Subscription ${invoice.subscription} marked as expired due to payment failure`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
