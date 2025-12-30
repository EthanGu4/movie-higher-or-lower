"use client";
import { motion, AnimatePresence } from "framer-motion";

type MovieCardProps = {
  title: string;
  movieId: number;
  rating?: number; 
  reveal?: boolean; 
};

// hard coded cuz i dotn want to manually add to database XD

const posters = [
  "/posters/aladdin.jpg",
  "/posters/alien.jpg",
  "/posters/apocalpysenow.jpg",
  "/posters/avatar2.jpg",
  "/posters/avatar3.webp",
  "/posters/birds.jpeg",
  "/posters/cars.jpg",
  "/posters/dark_knight.jpg",
  "/posters/diehard.jpeg",
  "/posters/f1.jpg",
  "/posters/fordvferrari.jpg",
  "/posters/francois.jpeg",
  "/posters/httyd.jpg",
  "/posters/httyd2.jpg",
  "/posters/httyd3.webp",
  "/posters/irongiant.jpeg",
  "/posters/joker.jpg",
  "/posters/kingkong.jpeg",
  "/posters/lotr1.jpeg",
  "/posters/lotr2.jpg",
  "/posters/oldboy.jpg",
  "/posters/oz.jpeg",
  "/posters/peterwendy.jpeg",
  "/posters/psycho.jpeg",
  "/posters/rocketeer.jpg",
  "/posters/shapeofwater.jpg",
  "/posters/sinners.jpg",
  "/posters/starwars1.jpg",
  "/posters/starwars2.jpg",
  "/posters/starwars3.jpg",
  "/posters/titanic.jpg",
  "/posters/zootopia.jpg"
]

export default function MovieCard({ title, movieId, rating, reveal = false }: MovieCardProps) {
  
  const posterIndex = movieId % posters.length; 
  const posterUrl = posters[posterIndex];
  
  return (
    <div className="w-64 rounded-2xl shadow-xl overflow-hidden border border-white/10 relative">
      <div
        className="h-90 w-full bg-cover bg-center relative flex items-center justify-center"
        style={{
          backgroundImage: `url('${posterUrl}')`,
        }}
      >
        <div className="bg-white/90 px-3 py-1 rounded text-black text-center font-bold text-lg absolute bottom-4 mx-4">
          {title}
        </div>
      </div>

      <AnimatePresence>
        {reveal && rating !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-zinc-800/70 text-center text-white text-lg font-semibold"
          >
            Rating: {rating.toFixed(1)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}