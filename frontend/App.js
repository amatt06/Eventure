import './styles/main.scss';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { renderLoginPage } from './pages/LoginPage.js';
import { renderSignupPage } from './pages/SignupPage.js';
import {renderDashboard} from "./pages/Dashboard";

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
        case 'dashboard':
            renderDashboard(root);
            break;
        default:
            renderLoginPage(root);
            break;
    }
});
