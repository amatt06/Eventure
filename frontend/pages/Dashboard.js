import Logo from '../assets/Nav-Logo.svg';

export function renderDashboard(root) {
    root.innerHTML = `
    <div class="dashboard-container">
        <!-- Top Navbar -->
        <div class="navbar">
            <div class="navbar-left">
                <img src="${Logo}" alt="Eventure Logo" />
            </div>
            <div class="navbar-right">
                <sl-button variant="text" class="nav-link">Dashboard</sl-button>
                <sl-button variant="text" class="nav-link">Profile</sl-button>
                <sl-button variant="text" class="nav-link">Sign Out</sl-button>
            </div>
        </div>

        <!-- Sidebar and Main Content -->
        <div class="content">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-header">
                    <h2>Events</h2>
                </div>
                <div class="event-list">
                    <sl-button variant="text" class="event-item">Tech Innovators Conference</sl-button>
                    <sl-button variant="text" class="event-item">Annual Charity Run</sl-button>
                    <sl-button variant="text" class="event-item">Digital Marketing Masterclass</sl-button>
                    <!-- Add more events dynamically here -->
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="main-content">
                <div class="event-details">
                    <h2 class="event-title">Tech Innovators Conference 2024</h2>
                    <p><strong>Date:</strong> 15th November 2024</p>
                    <p><strong>Time:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Location:</strong> London Tech Hub, 123 Innovation Way, London</p>
                    <p><strong>Description:</strong> Join us for an exciting day of talks, workshops, and networking opportunities...</p>
                    <sl-button variant="primary" class="rsvp-button">RSVP</sl-button>
                </div>
            </div>
        </div>
    `;
}