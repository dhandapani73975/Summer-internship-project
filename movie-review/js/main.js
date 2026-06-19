// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        navLinks.innerHTML = `
            <li><a href="/index.html">Home</a></li>
            <li><a href="/profile.html">Profile</a></li>
            <li><a href="#" id="logoutBtn" class="btn btn-outline">Logout</a></li>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        navLinks.innerHTML = `
            <li><a href="/index.html">Home</a></li>
            <li><a href="/login.html" class="btn btn-outline">Login</a></li>
            <li><a href="/signup.html" class="btn btn-primary">Sign Up</a></li>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
