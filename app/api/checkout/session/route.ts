import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id')!;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
  const s = await stripe.checkout.sessions.retrieve(session_id);
  let artifacts: any = undefined;
  try{ artifacts = s.metadata?.artifacts ? JSON.parse(s.metadata.artifacts) : undefined; }catch{}
  return NextResponse.json({ artifacts });
}
