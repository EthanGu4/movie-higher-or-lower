import { getRandomMovie } from "@/queries/movies";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");

  const movie = await getRandomMovie();

  let newRating: number;
  if (mode?.includes("letterboxd")) {
    const options = [-0.2, -0.1, 0.1, 0.2];
    const offset = options[Math.floor(Math.random() * options.length)];
    console.log(movie.letterboxd_rating, offset)
    newRating = movie.letterboxd_rating + offset;
    newRating = Math.round(newRating * 10) / 10;
    
    if (newRating === movie.letterboxd_rating) {
        console.log('hit')
        newRating += 0.1;
    };
  } else {
    const options = [-0.5, -0.4, -0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.4, 0.5];
    const offset = options[Math.floor(Math.random() * options.length)];
    
    newRating = movie.imdb_rating + offset;
    newRating = Math.round(newRating * 10) / 10;
    
    if (newRating === movie.imdb_rating) newRating += 0.2;
  }

  return Response.json({ movie, newRating });
}