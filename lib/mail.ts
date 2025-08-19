import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string; }){
  if(process.env.RESEND_API_KEY){
    const resp = await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html })
    });
    if(!resp.ok) throw new Error('Resend failed');
    return;
  }
  if(process.env.EMAIL_SERVER_HOST){
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
    });
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
    return;
  }
  console.warn('No mail provider configured');
}
