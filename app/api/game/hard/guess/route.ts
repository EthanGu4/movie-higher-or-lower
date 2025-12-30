export async function POST(req: Request) {
    const body = await req.json();
    const { movie, newRating, choice, mode } = body;

    let realRating: number;
    if (mode?.includes("letterboxd")) {
        realRating = movie.letterboxd_rating;
    } else {
        realRating = movie.imdb_rating;
    }

    let correct: boolean;
    if (choice === "higher") {
        correct = realRating > newRating;
    } else {
        correct = realRating < newRating;
    }

    return new Response(
        JSON.stringify({ correct, realRating }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}