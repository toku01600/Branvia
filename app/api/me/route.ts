import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(){
  const session = await getServerSession(authOptions as any);
  if(!session?.user?.email) return NextResponse.json({ ok:false });
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  return NextResponse.json({ ok:true, emailVerified: !!user?.emailVerified, subscriptionStatus: user?.subscriptionStatus || 'inactive' });
}
