import Logo from '../assets/Logo.svg';

export function renderSignupPage(root) {
    const url = 'https://fathomless-badlands-96443-e1d7db421141.herokuapp.com/';
    root.innerHTML = `
    <div class="signup-container">
      <div class="signup-left">
        <img src="${Logo}" alt="Eventure Logo" />
      </div>
      <div class="divider"></div>
      <div class="signup-right">
        <div class="signup-form">
          <h2>Sign Up</h2>
          <form id="signup-form">
            <sl-input name="first-name" type="text" placeholder="First Name" required></sl-input>
            <sl-input name="last-name" type="text" placeholder="Last Name"></sl-input>
            <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            <sl-input name="password" type="password" placeholder="Password" required></sl-input>
            <sl-input name="confirmPassword" type="password" placeholder="Confirm Password" required></sl-input>
            <div class="checkbox-container">
                <sl-checkbox name="isOrganiser">Organiser Account</sl-checkbox>
            </div>
            <sl-button type="submit" variant="primary" class="signup-button">Sign Up</sl-button>
            <sl-button variant="text" class="login-button">Back to Login</sl-button>
          </form>
        </div>
      </div>
    </div>
  `;

    // Navigate back to Login Page
    root.querySelector('.login-button').addEventListener('click', () => {
        const event = new CustomEvent('navigate', { detail: { page: 'login' } });
        document.dispatchEvent(event);
    });

    // Handle Signup Form Submission
    const signupForm = root.querySelector('#signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(signupForm);
        const firstName = formData.get('first-name');
        const lastName = formData.get('last-name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const accessLevel = formData.get('isOrganiser') === 'on';

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch(`${url}user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password, accessLevel }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            alert('Signup successful! You can now log in.');
            const event = new CustomEvent('navigate', { detail: { page: 'login' } });
            document.dispatchEvent(event);

        } catch (err) {
            console.error('Error signing up:', err);
            alert(err.message || 'An error occurred during signup.');
        }
    });
}