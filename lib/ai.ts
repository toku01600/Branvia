import OpenAI from 'openai';

export async function generateBrand({ industry, concept, color, audience, lang }:{
  industry:string, concept:string, color:string, audience:string, lang:'ja'|'en'
}){
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = lang==='ja'
    ? `あなたはブランドストラテジストです。業種:${industry} 理念:${concept} ターゲット:${audience}。魅力的なブランド名と短いタグラインを日本語で。色:${color}を基調に。JSONで {brandName, tagline, colorPalette: [hex...]} を返して。`
    : `You are a brand strategist. Industry:${industry} Concept:${concept} Audience:${audience}. Provide a catchy brand name and short tagline in English. Base color:${color}. Return JSON {brandName, tagline, colorPalette:[hex...]}.`;

  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role:'user', content: prompt }],
    temperature: 0.8
  });
  const text = r.choices?.[0]?.message?.content || '{}';
  try {
    const data = JSON.parse(text);
    if(!data.colorPalette) data.colorPalette = [color];
    return data;
  } catch(e){
    return { brandName: lang==='ja'?'サンプルブランド':'Sample Brand', tagline: 'AI powered branding', colorPalette:[color,'#333333','#777777'] };
  }
}
