'use client';
import { useEffect, useState } from 'react';

export default function SuccessPage(){
  const [downloadUrl,setDownloadUrl] = useState('');
  useEffect(()=>{
    (async ()=>{
      const sid = new URL(location.href).searchParams.get('session_id');
      if(!sid) return;
      const s = await fetch('/api/checkout/session?session_id='+sid).then(r=>r.json());
      if(s?.artifacts){
        const u = await fetch('/api/artifacts/sign',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ key: `artifacts/${sid}.zip` })}).then(r=>r.json());
        if(u?.url) setDownloadUrl(u.url);
      }
    })();
  },[]);
  return (<div className="card">
    <h2>決済完了</h2>
    {downloadUrl ? <a className="badge" href={downloadUrl}>ZIP をダウンロード</a> : <p>ダウンロード準備中…</p>}
  </div>);
}
