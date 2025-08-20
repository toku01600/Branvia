import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';

export default async function AdminPage(){
  const session = await getServerSession(authOptions as any);
  if(!(session as any)?.user?.email) return <p>ログインが必要です</p>;
  const role = (session as any).role;
  if(role!=='admin') return <p>アクセス権がありません</p>;
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  return <div><h2>Admin</h2><pre>{JSON.stringify(users, null, 2)}</pre></div>;
}
