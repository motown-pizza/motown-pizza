'use server';

import { NextResponse } from 'next/server';
import { signOut } from '@repo/auth';

export async function routeAuthSignOut() {
  try {
    const result = await signOut();

    if (result.error) throw new Error(result.error);

    return NextResponse.json(
      { message: result.message },
      { status: 200, statusText: 'Signed Out' },
    );
  } catch (error) {
    console.error('---> route handler error (sign out):', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
