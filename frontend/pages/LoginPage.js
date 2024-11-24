import Logo from '../assets/Logo.svg';

export function renderLoginPage(root) {
    root.innerHTML = `
    <div class="login-container">
      <div class="login-left">
        <img src="${Logo}" alt="Eventure Logo" />
      </div>
      <div class="login-right">
        <div class="login-form">
          <h2>Login</h2>
          <form id="login-form">
            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            <sl-input name="password" type="password" placeholder="Password" required></sl-input>
            <sl-button type="submit" variant="primary" class="login-button">Login</sl-button>
          </form>
          <sl-button variant="text" class="signup-button">Sign Up</sl-button>
        </div>
      </div>
    </div>
  `;

    // Handle Sign Up button click
    root.querySelector('.signup-button').addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: { page: 'signup' } });
        document.dispatchEvent(event);
    });

    // Handle Login form submission
    const loginForm = root.querySelector('#login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        console.log('Login submitted:', { email, password });
    });
}
