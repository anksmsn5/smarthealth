import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'
import { RowDataPacket } from 'mysql2/promise'

interface User extends RowDataPacket {
  id: number
  name: string
  email: string
  mobile: string
  password: string
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mobile: { label: 'Mobile', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { mobile, password } = credentials as { mobile: string; password: string }

        const [rows] = await db.query<User[]>(
          'SELECT * FROM users WHERE mobile = ?',
          [mobile]
        )

        const user = rows[0]

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
