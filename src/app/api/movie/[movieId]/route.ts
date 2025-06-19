import { NextRequest } from 'next/server';
import prismadb from "../../../../../lib/prismadb" // adjust path if needed
import serverAuth from '../../../../../lib/serverAuth';

export async function GET(req: NextRequest, context: { params: { movieId: string } }) {
  try {
    await serverAuth(req);
    
      const { movieId } = context.params;
    console.log("Debugging", context)
  if(typeof movieId != "string"){
    return new Response("Invalid Id", { status: 500 });

  }
 if(!movieId){
    return new Response("Invalid Id", { status: 500 });
  }
    const movie = await prismadb.movie.findUnique({
      where :{
          id: movieId,
      }
    });
     if(!movie){
    return new Response("Invalid Id", { status: 500 });

  }
     return new Response(JSON.stringify(movie), {
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