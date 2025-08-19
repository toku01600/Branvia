const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main(){
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if(!email || !pass){ console.log('ADMIN_* not set'); return; }
  const hash = await bcrypt.hash(pass, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if(existing){
    await prisma.user.update({ where: { email }, data: { role: 'admin', passwordHash: hash }});
    console.log('Admin updated:', email);
  } else {
    await prisma.user.create({ data: { email, passwordHash: hash, role: 'admin' } });
    console.log('Admin created:', email);
  }
}
main().finally(()=>prisma.$disconnect());
