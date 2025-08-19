'use client';
import { useState } from 'react';

export default function GeneratePage(){
  const [form,setForm] = useState({ industry:'', concept:'', color:'#444444', audience:'', lang:'ja' });
  const [result,setResult] = useState<any>(null);
  const [loading,setLoading] = useState(false);

  const generate = async ()=>{
    setLoading(true);
    const r = await fetch('/api/generate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)});
    const j = await r.json();
    setResult(j);
    setLoading(false);
  };

  const checkout = async (mode: 'payment'|'subscription')=>{
    const r = await fetch('/api/checkout',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, artifacts: result})});
    const j = await r.json();
    if(j.url) location.href = j.url;
  };

  return (<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
    <div className="card">
      <h3>入力</h3>
      <label>業種<input value={form.industry} onChange={e=>setForm(s=>({...s,industry:e.target.value}))}/></label>
      <label>理念<textarea value={form.concept} onChange={e=>setForm(s=>({...s,concept:e.target.value}))}/></label>
      <label>ターゲット<input value={form.audience} onChange={e=>setForm(s=>({...s,audience:e.target.value}))}/></label>
      <label>色<input type="color" value={form.color} onChange={e=>setForm(s=>({...s,color:e.target.value}))}/></label>
      <label>言語<select value={form.lang} onChange={e=>setForm(s=>({...s,lang:e.target.value as any}))}><option value="ja">日本語</option><option value="en">English</option></select></label>
      <div style={{marginTop:12}}><input id="tos" type="checkbox"/><label htmlFor="tos"> 利用規約に同意します</label></div>
      <button onClick={generate} disabled={loading}>{loading?'生成中…':'生成'}</button>
    </div>
    <div className="card">
      <h3>プレビュー</h3>
      {!result && <p>生成するとここに結果が表示されます。</p>}
      {result && (<div>
        <h4>{result.brandName}</h4>
        <p>{result.tagline}</p>
        <div style={{display:'flex',gap:8}}>
          {result.colorPalette?.map((c:string,i:number)=>(<div key={i} style={{width:24,height:24,background:c,border:'1px solid #eee'}}/>))}
        </div>
        <div style={{marginTop:12,display:'flex',gap:12}}>
          <button onClick={()=>checkout('payment')}>単発購入 ¥12,800</button>
          <button onClick={()=>checkout('subscription')}>月額購読 ¥6,980</button>
        </div>
      </div>)}
    </div>
  </div>);
}
