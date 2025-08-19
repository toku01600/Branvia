import Link from 'next/link';
export default function Pricing(){
  return (<div>
    <h2>Pricing / 料金</h2>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div className="card">
        <h3>One‑off Brand Pack</h3>
        <p><b>¥12,800</b></p>
        <Link className="badge" href="/generate">購入へ</Link>
      </div>
      <div className="card">
        <h3>Pro Monthly</h3>
        <p><b>¥6,980 / 月</b></p>
        <Link className="badge" href="/generate">購読へ</Link>
      </div>
    </div>
  </div>);
}
