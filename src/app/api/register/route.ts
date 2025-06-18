import { NextRequest, NextResponse } from 'next/server';
import prismadb from "../../../../lib/prismadb" // adjust path if needed
import bcrypt from 'bcrypt';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await prismadb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Example: save new user
    const user = await prismadb.user.create({
      data: { email, name, hashedPassword }, // ⚠️ Hash password in real apps
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
