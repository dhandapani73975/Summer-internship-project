let allMovies = [];

// Load welcome message
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    document.getElementById("welcomeUser").innerText = `Hi, ${user.name} 👋`;
}

async function loadMovies() {
    try {
        const res = await fetch("http://localhost:5000/api/movies");
        allMovies = await res.json();
        displayMovies(allMovies);
    } catch (err) {
        console.error("Error loading movies:", err);
        document.getElementById("movieContainer").innerHTML =
            '<div class="empty-state"><p>Unable to load movies. Please try again.</p></div>';
    }
}

function displayMovies(movies) {
    const container = document.getElementById("movieContainer");
    container.innerHTML = "";

    if (movies.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No movies found.</p></div>';
        return;
    }

    movies.forEach((movie, i) => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.style.animationDelay = `${i * 0.05}s`;
        card.style.cursor = "pointer";
        card.onclick = () => viewMovie(movie._id);
        card.innerHTML = `
            <div class="movie-card-img-wrap">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/220x310/1a1a2e/e50914?text=No+Image'">
            </div>
            <div class="movie-card-body">
                <h3>${movie.title}</h3>
                <div class="movie-card-meta">
                    <span class="movie-genre">${movie.genre}</span>
                    <span class="movie-year">${movie.releaseYear}</span>
                </div>
                <button class="card-btn" onclick="event.stopPropagation(); viewMovie('${movie._id}')">View Details</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function viewMovie(id) {
    window.location.href = `movie-details.html?id=${id}`;
}

function searchMovies() {
    const text = document.getElementById("searchInput").value.toLowerCase();
    const genre = document.getElementById("genreFilter").value;
    const filtered = allMovies.filter(m =>
        m.title.toLowerCase().includes(text) &&
        (genre === "All" || m.genre === genre)
    );
    displayMovies(filtered);
}

function filterMovies() {
    searchMovies();
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

document.getElementById("searchInput").addEventListener("input", searchMovies);
document.getElementById("genreFilter").addEventListener("change", filterMovies);

loadMovies();