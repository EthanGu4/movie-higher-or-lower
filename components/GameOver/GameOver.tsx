'use client';

type GameOverProps = {
  score?: number;
};
export default function GameOver( {score} : GameOverProps ) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 text-center text-white shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h2>
            <p>Final Score: {score}</p>
          </div>
        </div>
    )
}