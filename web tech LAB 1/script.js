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
        <h2>${user.login}</h2>
        <p>Name: ${user.name || 'Not available'}</p>
        <p>Followers: ${user.followers}</p>
        <p>Following: ${user.following}</p>
        <p>Public Repos: ${user.public_repos}</p>
        <p>Avatar: <img src="${user.avatar_url}" alt="Avatar"></p>
    `;
    userDetails.innerHTML = details;
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error';
    errorDiv.textContent = message;
    userDetails.appendChild(errorDiv);
}
