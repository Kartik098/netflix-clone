import { NextRequest } from "next/server";
import serverAuth from "../../../../lib/serverAuth";
import prismadb from "../../../../lib/prismadb";



export async function GET(req: NextRequest) {
  try {
    const { currentUser } = await serverAuth(req);
    const favouriteMovies = await prismadb.movie.findMany({
        where: {
            id:{
                in: currentUser?.favoriteIds
            }
        }
    });

    return new Response(JSON.stringify(favouriteMovies), {
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
