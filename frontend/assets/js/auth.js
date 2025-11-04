// Authentication utilities
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Save token to localStorage
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Remove token from localStorage (logout)
function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Save user data to localStorage
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Get user data from localStorage
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
  return getToken() !== null;
}

// Update login/logout button based on authentication state
function updateAuthButton() {
  // Find all login/logout buttons by looking for the common class or href
  const buttons = document.querySelectorAll('.btn-login, .btn-logout, a[href*="login.html"]');
  const isAuth = isAuthenticated();

  buttons.forEach(button => {
    if (isAuth) {
      // User is authenticated - show logout
      button.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      button.classList.add('btn-logout');
      button.classList.remove('btn-login');
      button.href = '#';
      
      // Remove old event listeners and add logout
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    } else {
      // User is not authenticated - show login
      button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      button.classList.add('btn-login');
      button.classList.remove('btn-logout');
      
      // Set proper href based on current page location
      if (window.location.pathname.includes('pages/')) {
        button.href = 'login.html';
      } else {
        button.href = 'pages/login.html';
      }
      
      // Remove any click handlers
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    }
  });
}

// Logout function
function logout() {
  // Clear all authentication data
  removeToken();
  
  // Update all auth buttons immediately
  updateAuthButton();
  
  // Redirect to home page if not already there, otherwise reload
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/frontend/')) {
    window.location.reload();
  } else {
    window.location.href = '../index.html';
  }
}

// Initialize auth button on page load
document.addEventListener('DOMContentLoaded', function() {
  updateAuthButton();
});
