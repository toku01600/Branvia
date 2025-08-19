import Link from 'next/link';
export default function Page(){
  return (<section style={{textAlign:'center'}}>
    <h1>BrandForge — AIでブランド作成</h1>
    <p>ロゴ/ネーミング/コピー/カラーをまとめて生成し、ZIPで納品します。</p>
    <p><Link className="badge" href="/generate">今すぐ試す</Link></p>
  </section>);
}
