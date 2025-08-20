import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mail';

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'database' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { label:'Email', type:'text'}, password:{ label:'Password', type:'password'} },
      async authorize(credentials){
        if(!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if(!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        return ok ? { id: user.id, email: user.email, name: user.name || user.email } as any : null;
      }
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url })=>{
        const html = `<p>Sign in to Branvia:</p><p><a href="${url}">${url}</a></p>`;
        await sendMail({ to: identifier, subject: 'Your sign-in link', html });
      },
      from: process.env.EMAIL_FROM
    })
  ]
};
