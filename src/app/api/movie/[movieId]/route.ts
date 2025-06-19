import { NextRequest } from 'next/server';
import prismadb from "../../../../../lib/prismadb" // adjust path if needed
import serverAuth from '../../../../../lib/serverAuth';


export async function GET(
  req: NextRequest,
 context: { params: Promise<{ movieId: string }> }
) {
  try {
    await serverAuth(req);

  const movieId = (await context.params).movieId;


  console.log("movieId:", movieId, typeof movieId); // ✅ Confirm it's a string
    if (!movieId || typeof movieId != 'string') {
      return new Response('Invalid movie ID', { status: 400 });
    }

    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return new Response('Movie not found', { status: 404 });
    }

    return new Response(JSON.stringify(movie), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('[MOVIE_GET_ERROR]', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}