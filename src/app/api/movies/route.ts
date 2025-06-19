import serverAuth from "../../../../lib/serverAuth";
import prismadb from "../../../../lib/prismadb";



export async function GET() {
  try {
    await serverAuth();
    const movies = await prismadb.movie.findMany({});

    return new Response(JSON.stringify(movies), {
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
