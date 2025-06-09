// app/api/purchase/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, package_id } = body;

    if (!user_id || !package_id) {
      return NextResponse.json(
        { message: 'User ID and Package ID are required.' },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      'INSERT INTO purchase (user_id, package_id, created_at) VALUES (?, ?, NOW())',
      [user_id, package_id]
    );

    return NextResponse.json(
      {
        message: 'Purchase successful',
        data: {
          user_id,
          package_id,
          inserted_id: (result as any).insertId, // optional
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in purchase API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
