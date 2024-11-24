import Logo from '../assets/Logo.svg'

export function renderSignupPage(root) {
    root.innerHTML = `
    <div class="signup-container">
      <div class="signup-left">
        <img src="${Logo}" alt="Eventure Logo" />
      </div>
      <div class="signup-right">
        <div class="signup-form">
          <h2>Sign Up</h2>
          <sl-form id="signup-form">
            <sl-input name="fullName" type="text" placeholder="Full Name" required></sl-input>
            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            <sl-input name="password" type="password" placeholder="Password" required></sl-input>
            <sl-input name="confirmPassword" type="password" placeholder="Confirm Password" required></sl-input>
            <sl-checkbox name="organiser">I want to set up as an organiser</sl-checkbox>
            <sl-button type="submit" variant="primary" class="signup-button">Sign Up</sl-button>
          </sl-form>
        </div>
      </div>
    </div>
  `;
}
