// js/movie.js
let currentMovieId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentMovieId = urlParams.get('id');
    
    if (!currentMovieId) {
        window.location.href = '/index.html';
        return;
    }

    renderMovieDetails();
});

function renderMovieDetails() {
    const container = document.getElementById('movieDetailContainer');
    const moviesMap = db.get('movies');
    const movie = moviesMap[currentMovieId];
    
    if (!movie) {
        container.innerHTML = '<h2>Movie not found.</h2>';
        return;
    }

    const stats = getMovieRatingStats(movie.id);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    container.innerHTML = `
        <div class="movie-detail-layout">
            <div>
                <img src="${movie.posterUrl}" alt="${movie.title}" class="detail-poster">
            </div>
            <div>
                <div class="detail-header">
                    <h1 class="detail-title">${movie.title}</h1>
                    <div class="detail-meta">
                        <span>${movie.releaseYear}</span> • 
                        <span>Director: ${movie.director}</span>
                    </div>
                    <div class="detail-meta">
                        ${movie.genre.map(g => `<span class="tag">${g}</span>`).join('')}
                    </div>
                    <div class="movie-rating" style="font-size: 1.5rem; margin-bottom: 1.5rem;">
                        ★ ${stats.avg > 0 ? stats.avg : 'New'} 
                        <span style="font-size: 1rem; font-weight: normal; color: var(--text-muted); margin-left: 0.5rem;">
                            based on ${stats.count} reviews
                        </span>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 0.5rem;">Plot</h3>
                <p class="detail-plot">${movie.plot}</p>
                
                <div class="detail-credits">
                    <h3>Cast</h3>
                    <p>${movie.cast.join(', ')}</p>
                </div>
            </div>
        </div>

        <section class="reviews-section">
            <div class="reviews-header">
                <h2>User Reviews</h2>
            </div>
            
            ${currentUser ? getReviewFormHtml() : '<div class="review-form-card"><p>Please <a href="/login.html" style="color: var(--primary-color);">log in</a> to write a review.</p></div>'}
            
            <div id="reviewsContainer"></div>
        </section>
    `;

    loadReviews();
}

window.getReviewFormHtml = function(existingReview = null) {
    const maxStars = 5;
    let starsHtml = '';
    const rating = existingReview ? existingReview.rating : 5;
    
    for (let i = maxStars; i >= 1; i--) {
        const checked = i === rating ? 'checked' : '';
        starsHtml += `
            <input type="radio" id="star${i}" name="rating" value="${i}" ${checked}>
            <label for="star${i}">★</label>
        `;
    }

    const mode = existingReview ? 'Edit' : 'Write';
    const text = existingReview ? existingReview.text : '';
    const reviewId = existingReview ? existingReview.id : '';

    return `
        <div class="review-form-card" id="reviewFormCard">
            <h3>${mode} a Review</h3>
            <form id="reviewForm" onsubmit="handleReviewSubmit(event, '${reviewId}')">
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Rating</label>
                    <div class="star-rating-input">
                        ${starsHtml}
                    </div>
                </div>
                <div class="form-group">
                    <label>Your Review</label>
                    <textarea id="reviewText" rows="4" required placeholder="What did you think about the movie?">${text}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">${mode} Review</button>
                ${existingReview ? '<button type="button" class="btn btn-outline" onclick="renderMovieDetails()">Cancel</button>' : ''}
            </form>
        </div>
    `;
}

window.handleReviewSubmit = function(e, editId = '') {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    let selectedRating = 5;
    const ratingInputs = document.getElementsByName('rating');
    for (let radio of ratingInputs) {
        if (radio.checked) {
            selectedRating = parseInt(radio.value);
            break;
        }
    }

    const text = document.getElementById('reviewText').value.trim();
    if (!text) {
        alert("Please enter review text.");
        return;
    }

    const reviews = db.get('reviews');
    
    if (editId) {
        if (reviews[editId] && reviews[editId].userId === currentUser.id) {
            reviews[editId].text = text;
            reviews[editId].rating = selectedRating;
        }
    } else {
        const newId = 'r' + generateId();
        reviews[newId] = {
            id: newId,
            movieId: currentMovieId,
            userId: currentUser.id,
            userName: currentUser.name,
            text: text,
            rating: selectedRating,
            createdAt: Date.now()
        };
    }
    
    db.set('reviews', reviews);
    renderMovieDetails(); // Full re-render to update stats and reset form
}

function loadReviews() {
    const container = document.getElementById('reviewsContainer');
    const reviewsMap = db.get('reviews');
    let reviews = db.toArray(reviewsMap)
        .filter(r => r.movieId === currentMovieId)
        .sort((a, b) => b.createdAt - a.createdAt);

    if (reviews.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted)">No reviews yet. Be the first to review!</p>';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let html = '';

    reviews.forEach(review => {
        const isOwner = currentUser && currentUser.id === review.userId;
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        let actionsHtml = '';
        if (isOwner) {
            actionsHtml = `
                <div class="review-actions">
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="editReview('${review.id}')">Edit</button>
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="deleteReview('${review.id}')">Delete</button>
                </div>
            `;
        }

        html += `
            <div class="review-card" id="review-${review.id}">
                <div class="review-card-header">
                    <div>
                        <div class="review-author">${review.userName}</div>
                        <div class="review-date">${formatDate(review.createdAt)}</div>
                    </div>
                    <div style="color: var(--star-color); letter-spacing: 2px;">
                        ${stars}
                    </div>
                </div>
                <p style="white-space: pre-wrap;">${review.text}</p>
                ${actionsHtml}
            </div>
        `;
    });

    container.innerHTML = html;
}

window.editReview = function(id) {
    const reviewsMap = db.get('reviews');
    const review = reviewsMap[id];
    if (!review) return;

    const formContainer = document.getElementById('reviewFormCard');
    if (formContainer) {
        formContainer.outerHTML = getReviewFormHtml(review);
        document.getElementById('reviewText').focus();
    }
};

window.deleteReview = function(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const reviewsMap = db.get('reviews');
    const review = reviewsMap[id];
    
    if (review && currentUser && review.userId === currentUser.id) {
        delete reviewsMap[id];
        db.set('reviews', reviewsMap);
        renderMovieDetails();
    }
};
