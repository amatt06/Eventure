import Logo from '../assets/Nav-Logo.svg';

export async function renderDashboard(root) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = '/login'; // Redirect to login page
        return;
    }

    // Fetch user events
    const events = await fetchUserEvents(token);

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
                    ${events.length > 0
        ? events
            .map(
                (event) => `
                        <sl-button variant="text" class="event-item" data-id="${event._id}">
                            ${event.title}
                        </sl-button>
                    `
            )
            .join('')
        : '<p>No events available</p>'}
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="main-content">
                <div class="event-details">
                    <h2 class="event-title">Select an event to see details</h2>
                </div>
            </div>
        </div>
    </div>
    `;

    // Add event listeners for each event button
    document.querySelectorAll('.event-item').forEach((button) => {
        button.addEventListener('click', async (e) => {
            const eventId = e.target.getAttribute('data-id');
            const eventDetails = await fetchEventDetails(eventId, token);
            displayEventDetails(eventDetails);
        });
    });

    async function fetchUserEvents(token) {
        try {
            const response = await fetch('http://localhost:5000/events/user', {
                method: 'GET',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                console.error(`Failed to fetch events: ${response.statusText}`);
                return [];
            }

            const events = await response.json();
            console.log('Fetched user events:', events); // Debug log
            return events;
        } catch (error) {
            console.error('Error fetching user events:', error);
            return [];
        }
    }

}
