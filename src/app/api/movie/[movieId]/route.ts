import prismadb from "../../../../../lib/prismadb";
import serverAuth from "../../../../../lib/serverAuth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await serverAuth();

    // Extract the movieId from the URL
    const url = new URL(req.url);
    const movieId = url.pathname.split("/").pop(); // or use regex

    console.log("movieId:", movieId, typeof movieId);

    if (!movieId || typeof movieId !== "string") {
      return new Response("Invalid movie ID", { status: 400 });
    }

    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return new Response("Movie not found", { status: 404 });
    }

    return new Response(JSON.stringify(movie), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("[MOVIE_GET_ERROR]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
