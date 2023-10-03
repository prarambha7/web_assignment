const githubForm = document.getElementById('githubForm');
const userDetails = document.getElementById('userDetails');

githubForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    userDetails.innerHTML = '';

    const username = document.getElementById('username').value;

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.status === 404) {
            throw new Error('User not found');
        }
        if (response.status === 403) {
            const resetTime = new Date(response.headers.get('X-RateLimit-Reset') * 1000);
            throw new Error(`API rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`);
        }
        const data = await response.json();
        displayUserDetails(data);
    } catch (error) {
        displayError(error.message);
    }
});

function displayUserDetails(user) {
    const details = `
        <div class="card">
            <div class="card-header">
                <h2>${user.login}</h2>
            </div>
            <div class="card-body">
                <p><strong>Name:</strong> ${user.name || 'Not available'}</p>
                <p><strong>Followers:</strong> ${user.followers}</p>
                <p><strong>Following:</strong> ${user.following}</p>
                <p><strong>Public Repos:</strong> ${user.public_repos}</p>
            </div>
        </div>
        <div class="text-center mt-3">
            <img src="${user.avatar_url}" alt="Avatar" class="img-fluid rounded-circle" style="max-width: 150px;">
        </div>
    `;
    userDetails.innerHTML = details;
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    userDetails.appendChild(errorDiv);
}
