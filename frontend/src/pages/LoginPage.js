export function renderLoginPage(root) {
    root.innerHTML = `
    <div class="login-container">
      <div class="login-left">
        <h1>Eventure</h1>
        <p>Plan, Organise, and RSVP with Ease!</p>
      </div>
      <div class="login-right">
        <sl-form id="login-form">
          <sl-input name="email" type="email" placeholder="Email" required></sl-input>
          <sl-input name="password" type="password" placeholder="Password" required></sl-input>
          <sl-button type="submit" variant="primary" class="login-button">Login</sl-button>
        </sl-form>
        <p class="signup-link">
          Don't have an account? <a href="#" id="create-account">Create a new account</a>
        </p>
      </div>
    </div>
  `;

    // Attach event listeners
    const form = document.getElementById('login-form');
    form.addEventListener('sl-submit', handleLoginSubmit);

    document.getElementById('create-account').addEventListener('click', (event) => {
        event.preventDefault();
        alert("Redirecting to Sign Up Page! (To be implemented)");
    });
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                alert('Login Successful! Redirecting to Dashboard...');
            } else {
                alert('Invalid credentials. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Login Error:', error);
            alert('An error occurred during login.');
        });
}