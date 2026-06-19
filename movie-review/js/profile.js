// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }

    renderProfileSidebar(currentUser);
    renderMyReviews(currentUser);
});

function renderProfileSidebar(currentUser) {
    const usersMap = db.get('users');
    const fullUser = usersMap[currentUser.id];
    
    const sidebar = document.getElementById('profileSidebar');
    if (!sidebar || !fullUser) return;

    sidebar.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Profile Info</h3>
        <p><strong>Name:</strong><br> ${fullUser.name}</p>
        <p style="margin-top: 1rem;"><strong>Email:</strong><br> ${fullUser.email}</p>
        <p style="margin-top: 1rem;"><strong>Date of Birth:</strong><br> ${fullUser.dob}</p>
        <p style="margin-top: 1rem;"><strong>Member Since:</strong><br> ${formatDate(fullUser.createdAt)}</p>
        <button class="btn btn-danger" style="margin-top: 2rem; width: 100%;" onclick="deleteAccount('${currentUser.id}')">Delete Account</button>
    `;
}

function renderMyReviews(currentUser) {
    const container = document.getElementById('myReviewsList');
    const reviewsMap = db.get('reviews');
    const moviesMap = db.get('movies');
    
    let userReviews = db.toArray(reviewsMap)
        .filter(r => r.userId === currentUser.id)
        .sort((a, b) => b.createdAt - a.createdAt);

    if (userReviews.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted)">You haven\'t written any reviews yet.</p>';
        return;
    }

    let html = '';
    userReviews.forEach(review => {
        const movie = moviesMap[review.movieId];
        const mTitle = movie ? movie.title : 'Unknown Movie';
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        html += `
            <div class="review-card" style="margin-bottom: 1.5rem;" id="review-${review.id}">
                <div class="review-card-header">
                    <div>
                        <div class="review-author"><a href="/movie-detail.html?id=${review.movieId}" style="color: var(--primary-color);">${mTitle}</a></div>
                        <div class="review-date">${formatDate(review.createdAt)}</div>
                    </div>
                    <div style="color: var(--star-color); letter-spacing: 2px;">
                        ${stars}
                    </div>
                </div>
                <p style="white-space: pre-wrap;">${review.text}</p>
                <div class="review-actions">
                    <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="deleteMyReview('${review.id}')">Delete</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

window.deleteMyReview = function(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const reviewsMap = db.get('reviews');
    if (reviewsMap[id]) {
        delete reviewsMap[id];
        db.set('reviews', reviewsMap);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        renderMyReviews(currentUser);
    }
};

window.deleteAccount = function(userId) {
    if (!confirm('Warning: This will permanently delete your account and all your reviews. Are you sure?')) return;
    
    const usersMap = db.get('users');
    delete usersMap[userId];
    db.set('users', usersMap);

    const reviewsMap = db.get('reviews');
    for (const [id, r] of Object.entries(reviewsMap)) {
        if (r.userId === userId) {
            delete reviewsMap[id];
        }
    }
    db.set('reviews', reviewsMap);

    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
};
