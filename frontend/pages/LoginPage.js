import Logo from '../assets/Logo.svg';

export function renderLoginPage(root) {
    root.innerHTML = `
    <div class="login-container">
      <div class="login-left">
        <img src="${Logo}" alt="Eventure Logo" />
      </div>
      <div class="divider"></div>
      <div class="login-right">
        <div class="login-form">
          <h2>Login</h2>
          <form id="login-form">
            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            <sl-input name="password" type="password" placeholder="Password" required></sl-input>
            <sl-button type="submit" variant="primary" class="login-button">Login</sl-button>
            <sl-button variant="text" class="signup-button">Sign Up</sl-button>
          </form>
        </div>
      </div>
    </div>
  `;

    // Navigate to Signup Page
    root.querySelector('.signup-button').addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: { page: 'signup' } });
        document.dispatchEvent(event);
    });

    // Handle Login Form Submission
    const loginForm = root.querySelector('#login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:5000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            // Store the token in localStorage
            localStorage.setItem('token', data.token);

            // Redirect to dashboard
            const event = new CustomEvent('navigate', { detail: { page: 'dashboard' } });
            document.dispatchEvent(event);

        } catch (err) {
            console.error('Error logging in:', err);
            alert(err.message || 'An error occurred during login.');
        }
    });
}