export function renderLoginPage(root) {
    root.innerHTML = `
    <div class="login-container">
      <div class="login-left">
        <img src="./assets/Logo.svg" alt="Eventure Logo" />
      </div>
      <div class="login-right">
        <div class="login-form">
          <h2>Login</h2>
          <sl-form id="login-form">
            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            <sl-input name="password" type="password" placeholder="Password" required></sl-input>
            <sl-button type="submit" variant="primary" class="login-button">Login</sl-button>
          </sl-form>
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
}
