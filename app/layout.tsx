import './globals.css';
import Link from 'next/link';
export const metadata = { title: 'BrandForge', description: 'AI brand builder' };
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ja"><body>
      <header style={{padding:'12px 24px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between'}}>
        <Link href="/"><b>BrandForge</b></Link>
        <nav>
          <Link href="/generate">Create</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/account">Account</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/api/auth/signin">Login</Link>
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer style={{borderTop:'1px solid #eee',padding:16,fontSize:12,color:'#666'}}>© {new Date().getFullYear()} BrandForge</footer>
    </body></html>
  );
}
