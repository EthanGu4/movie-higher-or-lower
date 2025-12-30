"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import GameOver from "@/components/GameOver/GameOver";
import { motion } from "framer-motion";

type Movie = {
  movie_id: number;
  movie_name: string;
  release_year: number;
  imdb_rating: number;
  letterboxd_rating: number;
};

export default function GamePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    
    const [left, setLeft] = useState<Movie | null>(null);
    const [right, setRight] = useState<Movie | null>(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [leftLife, setLeftLife] = useState(1);
    const [rightLife, setRightLife] = useState(1);

    const [revealRating, setRevealRating] = useState(false);
    const [showGameOverPopup, setShowGameOverPopup] = useState(false);

    useEffect(() => {
        if (!mode) {
            router.replace("/");
            return;
        }

        let cancelled = false;

        async function loadInitialRound() {
            const res = await fetch(`/api/game/start?mode=${mode}`);
            const data = await res.json();
            
            if (!cancelled) {
                setLeft(data.left);
                setRight(data.right);
            }
        }

        loadInitialRound();

        return () => {
            cancelled = true;
        };
    }, [mode, router]);

    async function loadNextMovie() {
        const res = await fetch("/api/game/next");
        return res.json();
    }
    async function handleGuess(choice: "left" | "right") {
        if (!left || !right) return;

        const res = await fetch("/api/game/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                left,
                right,
                choice,
                mode,
            }),
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

        const nextMovie = await loadNextMovie();
        
        if (round === 1) {
            const winner = choice === "left" ? left : right;

            setLeft(winner);
            setRight(nextMovie);

            setLeftLife(2); 
            setRightLife(1);

            setRound(2);
            return;
        }

        if (leftLife === 2 && rightLife === 2) {
            setLeft(nextMovie);
            setRight(await loadNextMovie());
            setLeftLife(1);
            setRightLife(1);
        } else if (leftLife === 2) {
            setLeft(nextMovie);
            setLeftLife(1);
            setRightLife((r) => r + 1);
        } else if (rightLife === 2) {
            setRight(nextMovie);
            setRightLife(1);
            setLeftLife((l) => l + 1);
        }

        setRound((r) => r + 1);
    }

    if (!left || !right) {
        return <p className="p-10 text-center">Loading...</p>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-10">
            <h1 className="text-4xl font-bold mb-2 text-center">
                Higher or Lower — {mode === "imdb" ? "IMDb Rating" : "Letterboxd Rating"}
            </h1>
            <p className="text-lg font-semibold mb-8 text-red-400">Score: {score}</p>

            <div className="flex items-center justify-center gap-8">
                <motion.div
                    onClick={() => handleGuess("left")}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                <MovieCard
                    title={left.movie_name}
                    movieId={left.movie_id}
                    rating={mode === "imdb" ? left.imdb_rating : left.letterboxd_rating}
                    reveal={revealRating}
                />
                </motion.div>

                <div className="text-2xl font-bold text-white/80 select-none">VS</div>

                <motion.div
                    onClick={() => handleGuess("right")}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                <MovieCard
                    title={right.movie_name}
                    movieId={right.movie_id}
                    rating={mode === "imdb" ? right.imdb_rating : right.letterboxd_rating}
                    reveal={revealRating}
                />
                </motion.div>
            </div>

            <p className="mt-10 text-center text-sm opacity-70 max-w-lg">
                Which movie has the higher{" "}
                <strong>{mode === "imdb" ? "IMDb" : "Letterboxd"}</strong> rating?
            </p>

            {showGameOverPopup && (
                <GameOver 
                    score={score}
                />
            )}
        </div>
    );
}