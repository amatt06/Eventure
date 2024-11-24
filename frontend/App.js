import './styles/main.scss';
import { renderLoginPage } from './pages/LoginPage.js';
import { renderSignupPage } from './pages/SignupPage.js';

const root = document.getElementById('root');

// Initially load the login page
renderLoginPage(root);

// Simple page navigation system
document.addEventListener('navigate', (e) => {
    const { page } = e.detail;

    switch (page) {
        case 'signup':
            renderSignupPage(root);
            break;
        default:
            renderLoginPage(root);
            break;
    }
});
