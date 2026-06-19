// js/store.js
const initialMovies = [
  {
    id: "m1",
    title: "Inception",
    genre: ["Sci-Fi", "Action", "Thriller"],
    releaseYear: 2010,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  },
  {
    id: "m2",
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    releaseYear: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: "m3",
    title: "Interstellar",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    releaseYear: 2014,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: "m4",
    title: "The Matrix",
    genre: ["Action", "Sci-Fi"],
    releaseYear: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  }
];

function initDB() {
    if (!localStorage.getItem('movies')) {
        const moviesObj = {};
        initialMovies.forEach(m => moviesObj[m.id] = m);
        localStorage.setItem('movies', JSON.stringify(moviesObj));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify({}));
    }
}
initDB();

const db = {
    get(collection) {
        return JSON.parse(localStorage.getItem(collection) || '{}');
    },
    set(collection, data) {
        localStorage.setItem(collection, JSON.stringify(data));
    },
    toArray(collectionMap) {
        return Object.values(collectionMap);
    }
};

function getMovieRatingStats(movieId) {
    const reviewsMap = db.get('reviews');
    const reviews = db.toArray(reviewsMap).filter(r => r.movieId === movieId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return {
        avg: (sum / reviews.length).toFixed(1),
        count: reviews.length
    };
}
