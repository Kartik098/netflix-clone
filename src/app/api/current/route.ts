import { NextRequest } from "next/server";
import serverAuth from "../../../../lib/serverAuth";

export async function GET() {
  try {
    const { currentUser } = await serverAuth();
    return new Response(JSON.stringify(currentUser), {
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
