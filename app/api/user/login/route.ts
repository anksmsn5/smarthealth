import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'  // assumes mysql2 connection is exported from here
import bcrypt from 'bcryptjs'
import { RowDataPacket } from 'mysql2/promise'

// Define the structure of a user row
interface User extends RowDataPacket {
  id: number
  name: string
  email: string
  mobile: string
  password: string
}

export async function POST(req: NextRequest) {
  try {
    const { mobile, password } = await req.json()

    if (!mobile || !password) {
      return NextResponse.json({ message: "Mobile and password are required." }, { status: 400 })
    }

    // Correctly typed query
    const [rows] = await db.query<User[]>(
      'SELECT id, name, email, mobile, password FROM users WHERE mobile = ?',
      [mobile]
    )

    const user = rows[0]

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
