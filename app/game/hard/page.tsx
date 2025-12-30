"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import GameOver from "@/components/GameOver/GameOver"

type Movie = {
  movie_id: number;
  movie_name: string;
  release_year: number;
  imdb_rating: number;
  letterboxd_rating: number;
};

export default function HardGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); 

  const [movie, setMovie] = useState<Movie | null>(null);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [revealRating, setRevealRating] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);

  useEffect(() => {
    if (!mode) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function loadMovie() {
      const res = await fetch(`/api/game/hard/next?mode=${mode}`);
      const data = await res.json();

      if (!cancelled) {
        setMovie(data.movie);
        setNewRating(data.newRating);
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [mode, router]);

  async function handleGuess(choice: "higher" | "lower") {
    if (!movie || newRating === null) return;

    const res = await fetch("/api/game/hard/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie, newRating, choice, mode }),
    });

    const result = await res.json();

    if (!result.correct) {
      setRevealRating(true);
      setShowGameOverPopup(true); 

      setTimeout(() => {
        router.replace("/");
      }, 1500); 
      return;
    }

    setScore((prev) => prev + 1);

    const resNext = await fetch(`/api/game/hard/next?mode=${mode}`);
    const dataNext = await resNext.json();
    setMovie(dataNext.movie);
    setNewRating(dataNext.newRating);
  }

  if (!movie || newRating === null) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }
  
  const actualRating = mode === 'imdb-hard' ? movie.imdb_rating : movie?.letterboxd_rating;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="w-full max-w-3xl px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-2">
          {mode === "imdb-hard" ? "IMDb" : "Letterboxd"}
        </h1>
        <p className="text-sm opacity-60 mb-10">:))</p>

        <div className="mb-12 text-xl font-semibold">
          Score: <span className="text-red-400">{score}</span>
        </div>

        <div className="flex items-center justify-center gap-10">
          <button
            onClick={() => handleGuess("lower")}
            className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition hover:scale-105 active:scale-95"
          >
            Lower than {newRating}
          </button>

          <MovieCard
            title={movie.movie_name}
            movieId={movie.movie_id}
            rating={actualRating} 
            reveal={revealRating} 
          />

          <button
            onClick={() => handleGuess("higher")}
            className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition hover:scale-105 active:scale-95"
          >
            Higher than {newRating}
          </button>
        </div>

        <p className="mt-12 text-sm opacity-70 max-w-xxl mx-auto">
          Does <span className="font-semibold">{movie.movie_name}</span> (<span>{movie.release_year}</span>) have a{" "}
          {mode === "imdb-hard" ? "IMDb" : "Letterboxd"} rating higher or lower than{" "}
          <span className="font-semibold">{newRating}</span>?
        </p>
      </div>

      {showGameOverPopup && (
        <GameOver 
          score={score}
        />
      )}
    </div>
  );
}