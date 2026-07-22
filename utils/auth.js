function getCurrentUser() {
    try {
        const user = localStorage.getItem('fine_ride_user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem('fine_ride_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('fine_ride_user');
    window.location.href = 'auth.html';
}