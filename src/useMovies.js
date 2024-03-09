import { useState, useEffect } from "react";
const KEY = "acc82eb2";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const page = 1;

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(""); // need to reset the error to show the fetched results
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${page}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        // console.log(data);

        if (data.Response === "False") throw new Error("Movie not found.");

        setMovies((movies) => data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
