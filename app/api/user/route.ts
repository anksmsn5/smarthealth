// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs' // Ensure this is installed: npm install bcryptjs

export async function POST(req: NextRequest) {
  const { name, email, password, mobile } = await req.json()

  if (!name || !email || !password || !mobile) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, mobile, type) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, mobile, '7']
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error inserting user:', error)
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 })
  }
}
