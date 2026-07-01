// console.log("movie-details.js loaded");

// const params = new URLSearchParams(window.location.search);

// const movieId = params.get("id");

// console.log("Movie ID:", movieId);

// async function loadMovie() {

//     try {

//         const response = await fetch(
//             `http://localhost:5000/api/movies/${movieId}`
//         );

//         const movie = await response.json();

//         console.log("Movie:", movie);

//         // document.getElementById("movieDetails").innerHTML = `
//         //     <h1>${movie.title}</h1>

//         //     <img
//         //     src="${movie.poster}"
//         //     width="300">

//         //     <p>${movie.genre}</p>

//         //     <p>${movie.releaseYear}</p>

//         //     <p>${movie.description}</p>
//         // `;
// //        
//         document.getElementById(
//     "movieDetails"
// ).innerHTML = `

//     <h1>${movie.title}</h1>

//     <img
//     src="${movie.poster}"
//     width="300">

//     <p>${movie.genre}</p>

//     <p>${movie.releaseYear}</p>

//     <p>${movie.description}</p>

//     <h2>Official Trailer</h2>

//     <iframe
//         width="700"
//         height="400"
//         src="${movie.trailer}"
//         title="Movie Trailer"
//         frameborder="0"
//         allowfullscreen>
//     </iframe>

// `;

//     } catch(error) {

//         console.error(error);

//     }
// }

// loadMovie();

// document
// .getElementById("reviewForm")
// .addEventListener("submit",
// async (e) => {

//     e.preventDefault();

//     const userName =
//     document.getElementById(
//         "userName"
//     ).value;

//     const rating =
//     document.getElementById(
//         "rating"
//     ).value;

//     const reviewText =
//     document.getElementById(
//         "reviewText"
//     ).value;

//     const response =
//     await fetch(
//         "http://localhost:5000/api/reviews",
//         {
//             method: "POST",

//             headers: {
//                 "Content-Type":
//                 "application/json"
//             },

//             body: JSON.stringify({

//                 movieId,

//                 userName,

//                 rating,

//                 reviewText

//             })
//         }
//     );

//     const data =
//     await response.json();

//     alert(data.message);

//     loadReviews();

// });

// async function loadReviews() {

//     try {

//         const response =
//         await fetch(
//             `http://localhost:5000/api/reviews/${movieId}`
//         );

//         const reviews =
//         await response.json();

//         const container =
//         document.getElementById(
//             "reviewsContainer"
//         );

//         container.innerHTML = "";

//         let totalRating = 0;

//         reviews.forEach(review => {

//             totalRating += Number(review.rating);

//             container.innerHTML += `

//                 <div class="review-card">

//                     <h3>${review.userName}</h3>

//                     <p>⭐ ${review.rating}/5</p>

//                     <p>${review.reviewText}</p>

//                 </div>

//             `;

//         });

//         const average =
//         reviews.length > 0
//         ? (totalRating / reviews.length).toFixed(1)
//         : 0;

//         document.getElementById(
//             "averageRating"
//         ).innerHTML =
//         `⭐ ${average}/5 (${reviews.length} reviews)`;

//     }
//     catch(error) {

//         console.log(error);

//     }

// }
// function setRating(value)
// {
//     document.getElementById(
//         "rating"
//     ).value = value;

//     console.log(
//         "Selected Rating:",
//         value
//     );
// }


// loadMovie();
// loadReviews();


const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// Load movie details
async function loadMovie() {
    try {
        const res = await fetch(`http://localhost:5000/api/movies/${movieId}`);
        const movie = await res.json();

        document.title = `${movie.title} | CineVerse`;

        document.getElementById("movieDetails").innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/280x400/1a1a2e/e50914?text=No+Image'">
            <div class="movie-details-info">
                <h1>${movie.title}</h1>
                <div class="movie-tags">
                    <span class="movie-tag tag-genre">${movie.genre}</span>
                    <span class="movie-tag tag-year">${movie.releaseYear}</span>
                </div>
                <p class="movie-description">${movie.description || 'No description available.'}</p>
            </div>
        `;

        if (movie.trailer) {
            document.getElementById("trailerSection").style.display = "block";
            document.getElementById("trailerFrame").src = movie.trailer;
        }
    } catch (err) {
        console.error("Error loading movie:", err);
    }
}

// Star rating
let selectedRating = 5;
const stars = document.querySelectorAll(".star-rating span");

function setRating(value) {
    selectedRating = value;
    document.getElementById("rating").value = value;
    stars.forEach(s => {
        s.style.color = parseInt(s.dataset.val) <= value ? "#f5a623" : "#333";
    });
}

stars.forEach(s => {
    s.addEventListener("mouseover", () => {
        const val = parseInt(s.dataset.val);
        stars.forEach(st => {
            st.style.color = parseInt(st.dataset.val) <= val ? "#f5a623" : "#333";
        });
    });
    s.addEventListener("mouseout", () => setRating(selectedRating));
    s.addEventListener("click", () => setRating(parseInt(s.dataset.val)));
});

setRating(5);

// Submit review
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".submit-btn");
    btn.textContent = "Submitting...";
    btn.disabled = true;

    try {
        const res = await fetch("http://localhost:5000/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                movieId,
                userName: document.getElementById("userName").value,
                rating: document.getElementById("rating").value,
                reviewText: document.getElementById("reviewText").value
            })
        });
        const data = await res.json();
        alert(data.message);
        e.target.reset();
        setRating(5);
        loadReviews();
    } catch (err) {
        alert("Failed to submit review.");
    } finally {
        btn.textContent = "Submit Review";
        btn.disabled = false;
    }
});

// Load reviews
async function loadReviews() {
    try {
        const res = await fetch(`http://localhost:5000/api/reviews/${movieId}`);
        const reviews = await res.json();
        const container = document.getElementById("reviewsContainer");

        if (reviews.length === 0) {
            container.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            document.getElementById("averageRating").innerHTML = '— / 5';
            return;
        }

        const total = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
        const avg = (total / reviews.length).toFixed(1);
        document.getElementById("averageRating").innerHTML =
            `⭐ ${avg} / 5 <span style="font-size:16px;color:#555;font-weight:400;">(${reviews.length} review${reviews.length !== 1 ? 's' : ''})</span>`;

        const stars = r => '★'.repeat(r) + '☆'.repeat(5 - r);
        container.innerHTML = reviews.map(r => `
            <div class="review-card">
                <div class="review-card-header">
                    <span class="review-card-name">${r.userName}</span>
                    <span class="review-card-rating">${stars(r.rating)} ${r.rating}/5</span>
                </div>
                <p class="review-card-text">"${r.reviewText}"</p>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

loadMovie();
loadReviews();