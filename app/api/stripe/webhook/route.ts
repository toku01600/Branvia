import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import JSZip from 'jszip';
import { uploadBuffer } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request){
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
  let event: Stripe.Event;
  try{
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  }catch(e:any){
    return new NextResponse(`Webhook Error: ${e.message}`, { status:400 });
  }

  if(event.type==='checkout.session.completed'){
    const s = event.data.object as Stripe.Checkout.Session;
    const meta = s.metadata?.artifacts;
    if(meta){
      try{
        const data = JSON.parse(meta);
        const zip = new JSZip();
        zip.file('brand.json', JSON.stringify(data, null, 2));
        zip.file('README.txt', 'Thank you for your purchase.');
        const buffer = await zip.generateAsync({ type:'nodebuffer' });
        const key = `artifacts/${s.id}.zip`;
        await uploadBuffer(key, buffer);
        // Optionally link to user if email known
        if(s.customer_details?.email){
          const u = await prisma.user.upsert({
            where: { email: s.customer_details.email },
            update: { subscriptionStatus: s.mode==='subscription' ? 'active':'one_time' },
            create: { email: s.customer_details.email, subscriptionStatus: s.mode==='subscription' ? 'active':'one_time' }
          });
          await prisma.artifact.create({ data: { userId: u.id, key } });
        }
      }catch{}
    }
  }

  if(event.type==='customer.subscription.deleted'){
    const sub = event.data.object as Stripe.Subscription;
    if(typeof sub.customer === 'string'){
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: sub.customer } });
      if(user) await prisma.user.update({ where: { id: user.id }, data: { subscriptionStatus: 'canceled' } });
    }
  }

  return NextResponse.json({ received: true });
}


