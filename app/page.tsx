"use client";
import { useRouter } from "next/navigation";

type ModeButtonProps = {
  label: string;
  subtitle: string;
  onClick: () => void;
  variant?: "normal" | "hard";
};

function ModeButton({
  label,
  subtitle,
  onClick,
  variant = "normal",
}: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl p-6 text-left transition
        ${
          variant === "hard"
            ? "bg-red-500/10 hover:bg-red-500/20 border border-red-400/30"
            : "bg-white/10 hover:bg-white/20 border border-white/20"
        }
        backdrop-blur-md shadow-lg hover:scale-[1.02] active:scale-[0.98]
      `}
    >
      <div className="text-xl font-semibold">{label}</div>
      <div className="text-sm opacity-70 mt-1">{subtitle}</div>
    </button>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight">
          Higher or Lower
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-sm uppercase tracking-widest opacity-60 mb-4">
              Normal Mode
            </h2>
            <div className="space-y-4">
              <ModeButton
                label="IMDb"
                subtitle="Guess which movie has the higher IMDb rating"
                onClick={() => router.push("/game?mode=imdb")}
              />
              <ModeButton
                label="Letterboxd"
                subtitle="Guess which movie has the higher Letterboxd rating"
                onClick={() => router.push("/game?mode=letterboxd")}
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-widest opacity-60 mb-4">
              Alternate Mode
            </h2>
            <div className="space-y-4">
              <ModeButton
                label="IMDb"
                subtitle=":)"
                variant="hard"
                onClick={() => router.push("/game/hard?mode=imdb-hard")}
              />
              <ModeButton
                label="Letterboxd"
                subtitle=":)"
                variant="hard"
                onClick={() =>
                  router.push("/game/hard?mode=letterboxd-hard")
                }
              />
            </div>
          </div>
        </div>

        <p className="text-center text-xs opacity-40 mt-12">
          Higher rating wins · Copyright © Ethan Gu
        </p>
      </div>
    </div>
  );
}