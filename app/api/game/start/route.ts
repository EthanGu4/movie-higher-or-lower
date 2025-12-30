import { getTwoRandomMovies } from "@/queries/movies";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  if (!mode) {
    return new Response("Mode required", { status: 400 });
  }

  const movies = await getTwoRandomMovies();

  return Response.json({
    left: movies[0],
    right: movies[1],
    mode,
  });
}