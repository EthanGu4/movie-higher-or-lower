export async function POST(req: Request) {
  const { left, right, choice, mode } = await req.json();

  const leftRating =
    mode === "imdb" ? left.imdb_rating : left.letterboxd_rating;
  const rightRating =
    mode === "imdb" ? right.imdb_rating : right.letterboxd_rating;

  const correct =
    (choice === "left" && leftRating >= rightRating) ||
    (choice === "right" && rightRating >= leftRating);

  return Response.json({
    correct,
    leftRating,
    rightRating,
  });
}