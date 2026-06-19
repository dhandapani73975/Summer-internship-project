// js/home.js
let allMovies = [];
let debounceTimer;

document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderMovies(e.target.value, document.getElementById('genreFilter').value);
            }, 300);
        });
    }

    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
        genreFilter.addEventListener('change', (e) => {
            const searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
            renderMovies(searchVal, e.target.value);
        });
    }
});

function loadMovies() {
    const moviesMap = db.get('movies');
    allMovies = db.toArray(moviesMap);
    renderMovies();
}

function renderMovies(searchTerm = '', genre = '') {
    const grid = document.getElementById('movieGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    let filtered = allMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = genre === '' || movie.genre.includes(genre);
        return matchesSearch && matchesGenre;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1;">No movies found matching your criteria.</p>';
        return;
    }

    filtered.forEach(movie => {
        const stats = getMovieRatingStats(movie.id);
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <a href="/movie-detail.html?id=${movie.id}">
                <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.releaseYear}</span>
                        <div class="movie-rating">
                            ★ ${stats.avg > 0 ? stats.avg : 'N/A'} <span style="font-size: 0.8rem; font-weight: normal;">(${stats.count})</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });
}
