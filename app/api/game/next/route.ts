import { getTwoRandomMovies } from "@/queries/movies";

export async function GET() {
  const movies = await getTwoRandomMovies();
  return Response.json(movies[0]);
}