import { NextRequest, NextResponse } from 'next/server';
import prismadb from "../../../../lib/prismadb" // adjust path if needed
import serverAuth from '../../../../lib/serverAuth';

export async function GET(req: NextRequest) {
  try {
    await serverAuth(req);
    const moviecount = await prismadb.movie.count()
    const randomIndex = Math.floor(Math.random() * moviecount)

    const randomMovie = await prismadb.movie.findMany({
        take:1,
        skip: randomIndex
    });

     return new Response(JSON.stringify(randomMovie[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response("Not signed in", { status: 401 });
  }
}