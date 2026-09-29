import axios from "axios";

export const IMG_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
});

// Convert API errors into friendly messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = "Something went wrong. Please try again.";
    if (!err.response) message = "Network error. Check your internet connection.";
    else if (err.response.status === 401) message = "Invalid API key.";
    else if (err.response.status === 404) message = "Movie not found.";
    else if (err.response.status === 429) message = "Too many requests. Please wait a moment.";
    return Promise.reject(new Error(message));
  }
);

export const getTrending = (page = 1) =>
  api.get("/trending/movie/week", { params: { page } }).then((r) => r.data);

export const searchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page } }).then((r) => r.data);

export const getMovieDetails = (id) =>
  api
    .get(`/movie/${id}`, { params: { append_to_response: "credits,videos" } })
    .then((r) => r.data);

export const getGenres = () =>
  api.get("/genre/movie/list").then((r) => r.data.genres);

// Bonus: filter by genre / year / rating
export const discoverMovies = ({ genre, year, rating }, page = 1) =>
  api
    .get("/discover/movie", {
      params: {
        page,
        with_genres: genre || undefined,
        primary_release_year: year || undefined,
        "vote_average.gte": rating || undefined,
        sort_by: "popularity.desc",
      },
    })
    .then((r) => r.data);