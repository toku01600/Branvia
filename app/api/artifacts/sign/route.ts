import { NextResponse } from 'next/server';
import { signDownloadUrl } from '@/lib/storage';
import { uploadBuffer } from '../../../lib/storage';

export async function POST(req: Request){
  const data = await req.json();
  const key = data?.key;
  if(!key) return NextResponse.json({ ok:false, error:'key required' }, { status:400 });
  const url = await signDownloadUrl(key, 1800);
  return NextResponse.json({ ok:true, url });
}
