import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request){
  const { email, password, mode } = await req.json();
  if(!email) return NextResponse.json({ ok:false, error:'email required' }, { status:400 });
  const exists = await prisma.user.findUnique({ where: { email }});
  if(exists) return NextResponse.json({ ok:false, error:'already registered' }, { status:400 });
  const data:any = { email };
  if(mode==='password'){
    if(!password) return NextResponse.json({ ok:false, error:'password required' }, { status:400 });
    data.passwordHash = await bcrypt.hash(password, 10);
  }
  await prisma.user.create({ data });
  return NextResponse.json({ ok:true, message:'登録しました。ログインしてください。' });
}
