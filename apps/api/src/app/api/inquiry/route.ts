import { NextRequest, NextResponse } from 'next/server';
import { emailSendInquiry } from '@repo/email';
import { emailContactAdd } from '@repo/email';
import { FormValuesInquiry } from '@repo/types';

export async function POST(request: NextRequest) {
  try {
    const formData: FormValuesInquiry = await request.json();

    // send email
    const sendMail = await emailSendInquiry(formData);

    // add email contact to subscriber list
    const addContact = await emailContactAdd(formData);

    return NextResponse.json(
      {
        sendMail,
        addContact,
        message: 'Email sent successfully',
      },
      { status: 200, statusText: 'Email Sent' },
    );
  } catch (error) {
    console.error('---> route handler error (send inquiry):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
