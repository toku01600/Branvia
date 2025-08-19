'use client';
import { useEffect, useState } from 'react';

export default function AccountPage(){
  const [status,setStatus] = useState('');
  useEffect(()=>{
    fetch('/api/me').then(r=>r.json()).then(j=>{
      setStatus(j.subscriptionStatus||'inactive');
    });
  },[]);
  const openPortal = async ()=>{
    const r = await fetch('/api/stripe/portal',{ method:'POST' });
    const j = await r.json();
    if(j.url) location.href = j.url;
  };
  return (<div className="card">
    <h2>アカウント</h2>
    <p>サブスク状態: <b>{status}</b></p>
    <button onClick={openPortal}>Stripe カスタマーポータルを開く</button>
  </div>);
}
