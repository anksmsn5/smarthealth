import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Query total orders for this user
    const [orderRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS totalOrders FROM purchase WHERE user_id = ?',
      [userId]
    );

    // Query user profile
    const [userRows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      totalOrders: orderRows[0].totalOrders,
      userProfile: userRows[0],
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
