import pool from "@/lib/db";


export async function getRandomMovie() {
  const res = await pool.query(`
    SELECT movie_id, movie_name, release_year, imdb_rating, letterboxd_rating
    FROM movies
    ORDER BY RANDOM()
    LIMIT 1
  `);
  return res.rows[0];
}

export async function getTwoRandomMovies() {
  const res = await pool.query(`
    SELECT movie_id, movie_name, release_year, imdb_rating, letterboxd_rating
    FROM movies
    ORDER BY RANDOM()
    LIMIT 2
  `);
  return res.rows;
}