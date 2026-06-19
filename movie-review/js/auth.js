// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleSignup(e) {
    e.preventDefault();
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let hasError = false;

    if (!email.includes('@')) {
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmError').style.display = 'block';
        hasError = true;
    }

    if (hasError) return;

    const users = db.get('users');
    
    // Check if email exists
    const existingUser = Object.values(users).find(u => u.email === email);
    if (existingUser) {
        const formError = document.getElementById('formError');
        formError.textContent = 'Email is already registered.';
        formError.style.display = 'block';
        return;
    }

    // Create user
    const userId = 'u' + generateId();
    const newUser = {
        id: userId,
        name,
        email,
        dob,
        password, // In a real app, this would be hashed securely
        createdAt: Date.now()
    };

    users[userId] = newUser;
    db.set('users', users);

    // Auto login
    localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    }));

    window.location.href = '/index.html';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    errorEl.style.display = 'none';

    const users = db.get('users');
    const user = Object.values(users).find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        window.location.href = '/index.html';
    } else {
        errorEl.textContent = 'Invalid email or password.';
        errorEl.style.display = 'block';
    }
}
