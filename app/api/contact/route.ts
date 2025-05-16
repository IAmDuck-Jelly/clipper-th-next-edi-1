import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: 'uptowntrading.co.th',
    port: 465,
    secure: true,
    auth: {
      user: 'bome@uptowntrading.co.th',
      pass: 'Fuwa2103!',
    },
  });

  try {
    await transporter.sendMail({
      from: 'bome@uptowntrading.co.th',
      to: 'bome@uptowntrading.co.th',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 