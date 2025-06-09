import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

interface UserRow extends RowDataPacket {
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = await req.json();

    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: 'New password and confirm password do not match.' }, { status: 400 });
    }

    // Fetch the user's current (hashed) password
    const [rows] = await db.query<UserRow[]>('SELECT password FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Compare old password with hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Old password is incorrect.' }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    return NextResponse.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
