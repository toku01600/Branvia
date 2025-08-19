import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request){
  const { mode, artifacts } = await req.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
  const price = mode==='subscription' ? process.env.STRIPE_PRICE_ID_MONTHLY! : process.env.STRIPE_PRICE_ID_ONE_OFF!;
  const session = await stripe.checkout.sessions.create({
    mode: mode==='subscription' ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/generate`,
    metadata: { artifacts: JSON.stringify(artifacts || {}) }
  });
  return NextResponse.json({ url: session.url });
}
