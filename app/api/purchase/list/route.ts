// app/api/purchase/list/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      `SELECT 
          p.id AS purchase_id,
          p.user_id,
          p.created_at,
          pk.package_name,
          pk.amount
        
        FROM 
          purchase p
        JOIN 
          packages pk ON p.package_id = pk.id
        WHERE 
          p.user_id = ?
        ORDER BY p.created_at DESC
      `,
      [user_id]
    );

    return NextResponse.json(
      {
        message: 'Data fetched successfully',
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching purchase list:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
