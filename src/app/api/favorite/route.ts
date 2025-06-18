import { NextRequest } from "next/server";
import serverAuth from "../../../../lib/serverAuth";
import prismadb from "../../../../lib/prismadb";
import { without } from "lodash";


export async function POST(req: NextRequest) {
  try {
    const { currentUser } = await serverAuth(req);
    const body = await req.json();
    const movieId = body.movieId;
    const existingMovies = await prismadb.movie.findMany({
        where:{ id:movieId,}
    });
    if(!existingMovies){
        return new Response("Invalid ID", { status: 404 });
    }
    const user = await prismadb.user.update({
        where: {
            email:currentUser.email || '',   
        },
        data: {
            favoriteIds:{
                push:movieId,
            }
        }
    })
    return new Response(JSON.stringify(user), {
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

export async function DELETE(req: NextRequest) {
  try {
    const { currentUser } = await serverAuth(req);
    const body = await req.json();
    const movieId = body.movieId;

    const existingMovie = await prismadb.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      return new Response("Invalid ID", { status: 404 });
    }

    const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

    const user = await prismadb.user.update({
      where: {
        email: currentUser.email || '',
      },
      data: {
        favoriteIds: updatedFavoriteIds,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.error("API Error (DELETE):", err);
    return new Response("Not signed in", { status: 401 });
  }
}