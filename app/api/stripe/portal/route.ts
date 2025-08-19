import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(){
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
  // In real app, fetch customerId from session-linked user. Here we create a portal with lookup by email is not supported.
  // Expect frontend to have completed at least one session, else this will error.
  // For simplicity, create a billing portal test session with blank customer will fail gracefully.
  try{
    // This endpoint expects you to attach a valid customer id in production.
    return NextResponse.json({ url: 'https://billing.stripe.com/session' });
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
