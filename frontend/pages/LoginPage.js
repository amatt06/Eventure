import Logo from '../assets/Logo.svg';

export function renderLoginPage(root) {
    const url = 'http://localhost:5000/';
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
            // Step 1: Authenticate user and obtain token
            const authResponse = await fetch(`${url}auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!authResponse.ok) {
                const error = await authResponse.json();
                throw new Error(error.message || 'Login failed');
            }

            const authData = await authResponse.json();
            console.log('Login successful:', authData);

            // Store the token in localStorage
            const token = authData.token;
            localStorage.setItem('token', token);

            // Step 2: Validate the token and extract user info
            const validationResponse = await fetch(`${url}auth/validate`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                },
            });

            if (!validationResponse.ok) {
                const error = await validationResponse.json();
                throw new Error(error.message || 'Token validation failed');
            }

            const userData = await validationResponse.json();
            console.log('Token validated. User data:', userData);

            // Store additional user information in localStorage
            localStorage.setItem('email', userData.email);
            localStorage.setItem('accessLevel', userData.accessLevel);

            // Step 3: Redirect to dashboard
            const event = new CustomEvent('navigate', { detail: { page: 'dashboard' } });
            document.dispatchEvent(event);

        } catch (err) {
            console.error('Error during login:', err);
            alert(err.message || 'An error occurred during login.');
        }
    });
}