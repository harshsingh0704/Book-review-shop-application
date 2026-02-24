const API_BASE = 'http://localhost:3000';
let currentToken = null;
let currentUsername = null;
let currentBookISBN = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAuthState();
});

// ============= Auth Functions =============
function loadAuthState() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        currentToken = token;
        currentUsername = username;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (currentToken && currentUsername) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        document.getElementById('username-display').textContent = `Welcome, ${currentUsername}!`;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;
    const errorDiv = document.getElementById('register-error');
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            errorDiv.textContent = '';
            alert('Registration successful! Please login.');
            closeRegisterModal();
            showLoginModal();
        } else {
            errorDiv.textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Error registering: ' + error.message;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', username);
            currentToken = data.token;
            currentUsername = username;
            updateAuthUI();
            errorDiv.textContent = '';
            closeLoginModal();
            showHome();
        } else {
            errorDiv.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Error logging in: ' + error.message;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    currentToken = null;
    currentUsername = null;
    updateAuthUI();
    showHome();
}

// ============= Modal Functions =============
function showLoginModal() {
    if (currentToken) return;
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').textContent = '';
}

function showRegisterModal() {
    if (currentToken) return;
    document.getElementById('registerModal').classList.add('show');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-password-confirm').value = '';
    document.getElementById('register-error').textContent = '';
}

function switchToRegister() {
    closeLoginModal();
    showRegisterModal();
    return false;
}

function switchToLogin() {
    closeRegisterModal();
    showLoginModal();
    return false;
}

function showReviewModal(isbn) {
    if (!currentToken) {
        alert('Please login to add/modify reviews');
        showLoginModal();
        return;
    }
    currentBookISBN = isbn;
    document.getElementById('reviewModal').classList.add('show');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('show');
    document.getElementById('review-text').value = '';
    document.getElementById('review-error').textContent = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const reviewModal = document.getElementById('reviewModal');
    
    if (event.target === loginModal) closeLoginModal();
    if (event.target === registerModal) closeRegisterModal();
    if (event.target === reviewModal) closeReviewModal();
};

// ============= Search Functions =============
function switchSearch(type) {
    // Hide all forms
    document.querySelectorAll('.search-form').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.btn-search-type').forEach(el => el.classList.remove('active'));
    
    // Show selected form
    document.getElementById(`search-${type}`).classList.add('active');
    event.target.classList.add('active');
}

async function loadAllBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        showError('Error loading books: ' + error.message);
    }
}

async function searchByISBN() {
    const isbn = document.getElementById('isbn-input').value.trim();
    if (!isbn) {
        showError('Please enter an ISBN');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/books/isbn/${isbn}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const book = await response.json();
            displayBooks([book]);
        } else {
            showError('Book not found');
        }
    } catch (error) {
        showError('Error searching: ' + error.message);
    }
}

async function searchByAuthor() {
    const author = document.getElementById('author-input').value.trim();
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/books/author/${encodeURIComponent(author)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const books = await response.json();
        if (books.length === 0) {
            showError('No books found by this author');
        } else {
            displayBooks(books);
        }
    } catch (error) {
        showError('Error searching: ' + error.message);
    }
}

async function searchByTitle() {
    const title = document.getElementById('title-input').value.trim();
    if (!title) {
        showError('Please enter a title');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/books/title/${encodeURIComponent(title)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const books = await response.json();
        if (books.length === 0) {
            showError('No books found with this title');
        } else {
            displayBooks(books);
        }
    } catch (error) {
        showError('Error searching: ' + error.message);
    }
}

// ============= Display Functions =============
function displayBooks(books) {
    const container = document.getElementById('books-container');
    
    if (!books || books.length === 0) {
        container.innerHTML = '<div class="loading">No books found</div>';
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <div class="book-isbn">ISBN: ${book.isbn}</div>
            
            <div class="book-reviews">
                <h4>Reviews (${Object.keys(book.reviews || {}).length})</h4>
                ${Object.keys(book.reviews || {}).length > 0 
                    ? Object.entries(book.reviews).map(([user, review]) => `
                        <div class="review-item">
                            <span class="review-author">${user}:</span>
                            <div class="review-text">"${review}"</div>
                        </div>
                    `).join('')
                    : '<p style="color: #999; font-size: 0.9em;">No reviews yet</p>'
                }
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary" onclick="showReviewModal('${book.isbn}')">
                    ${currentToken ? 'Add/Edit Review' : 'Login to Review'}
                </button>
                ${currentToken && book.reviews && book.reviews[currentUsername]
                    ? `<button class="btn btn-danger" onclick="deleteReview('${book.isbn}')">Delete My Review</button>`
                    : ''
                }
            </div>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('books-container');
    container.innerHTML = `<div class="error">${message}</div>`;
}

function showHome() {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById('home').classList.add('active');
}

// ============= Review Functions =============
async function handleAddReview(event) {
    event.preventDefault();
    
    if (!currentToken) {
        alert('Please login first');
        return;
    }
    
    const reviewText = document.getElementById('review-text').value;
    const errorDiv = document.getElementById('review-error');
    
    try {
        const response = await fetch(`${API_BASE}/books/${currentBookISBN}/review`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ review: reviewText })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeReviewModal();
            loadAllBooks();
            showSuccess('Review added/updated successfully!');
        } else {
            errorDiv.textContent = data.message || 'Failed to add review';
        }
    } catch (error) {
        errorDiv.textContent = 'Error adding review: ' + error.message;
    }
}

async function deleteReview(isbn) {
    if (!currentToken) {
        alert('Please login first');
        return;
    }
    
    if (!confirm('Are you sure you want to delete your review?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/books/${isbn}/review`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            loadAllBooks();
            showSuccess('Review deleted successfully!');
        } else {
            showError(data.message || 'Failed to delete review');
        }
    } catch (error) {
        showError('Error deleting review: ' + error.message);
    }
}

function showSuccess(message) {
    const container = document.getElementById('books-container');
    container.innerHTML = `<div class="success">${message}</div>`;
    setTimeout(() => loadAllBooks(), 1500);
}

// ============= Node.js Client Methods Documentation =============
function showClientMethods() {
    const container = document.getElementById('books-container');
    container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #667eea; margin-bottom: 20px;">Node.js Client Methods</h2>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
                <h3>Task 10: Get All Books (Async Callback)</h3>
                <p><strong>Method:</strong> getAllBooksCallback(callback)</p>
                <p><strong>Description:</strong> Fetches all books using axios with callback pattern</p>
                <pre style="background: #333; color: #0f0; padding: 10px; border-radius: 4px; overflow-x: auto;">getAllBooksCallback((err, books) => {
  if (err) console.error(err);
  else console.log(books);
});</pre>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
                <h3>Task 11: Search by ISBN (Promises)</h3>
                <p><strong>Method:</strong> getBookByIsbn(isbn)</p>
                <p><strong>Description:</strong> Searches book by ISBN using Promise pattern</p>
                <pre style="background: #333; color: #0f0; padding: 10px; border-radius: 4px; overflow-x: auto;">getBookByIsbn('9780143127741')
  .then(book => console.log(book))
  .catch(err => console.error(err));</pre>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
                <h3>Task 12: Search by Author (Async/Await)</h3>
                <p><strong>Method:</strong> async getBooksByAuthor(author)</p>
                <p><strong>Description:</strong> Fetches books by author using async/await</p>
                <pre style="background: #333; color: #0f0; padding: 10px; border-radius: 4px; overflow-x: auto;">const books = await getBooksByAuthor('Paulo Coelho');
console.log(books);</pre>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
                <h3>Task 13: Search by Title (Async/Await)</h3>
                <p><strong>Method:</strong> async getBooksByTitle(title)</p>
                <p><strong>Description:</strong> Fetches books by title using async/await</p>
                <pre style="background: #333; color: #0f0; padding: 10px; border-radius: 4px; overflow-x: auto;">const books = await getBooksByTitle('Pride');
console.log(books);</pre>
            </div>
            
            <div style="padding: 15px; background: #667eea; color: white; border-radius: 4px;">
                <strong>Note:</strong> All methods use axios for HTTP requests. Run with: <code>node client.js</code>
            </div>
        </div>
    `;
}
