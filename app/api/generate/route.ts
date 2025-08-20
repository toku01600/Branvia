import { NextResponse } from 'next/server';
import { generateBrand } from '../../../lib/ai';
import JSZip from 'jszip';

export async function POST(req: Request){
  const body = await req.json();
  const data = await generateBrand(body);
  const zip = new JSZip();
  zip.file('brand.json', JSON.stringify(data, null, 2));
  zip.file('README.txt', 'BrandForge generated brand assets.');
  const buffer = await zip.generateAsync({ type:'nodebuffer' });
  const base64 = buffer.toString('base64');
  return NextResponse.json({ ...data, artifactBase64: base64 });
}
