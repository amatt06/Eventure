import Logo from '../assets/Nav-Logo.svg';

export async function renderCreateEventPage(root) {
    const url = 'https://fathomless-badlands-96443-e1d7db421141.herokuapp.com/';
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found. Redirecting to login.');
        window.location.href = '/login'; // Redirect to login page
        return;
    }

    root.innerHTML = `
    <div class="create-event-container">
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

        <!-- Create Event Form -->
        <div class="create-event-content">
            <div class="form-container">
                <!-- Left Form: Event Details -->
                <div class="event-details-form">
                    <h2>Create Event</h2>
                    <label>
                        <strong>Title:</strong>
                        <sl-input type="text" class="event-title" placeholder="Event Title"></sl-input>
                    </label>
                    <label>
                        <strong>Description:</strong>
                        <sl-textarea class="event-description" placeholder="Event Description"></sl-textarea>
                    </label>
                    <label>
                        <strong>Date:</strong>
                        <sl-input type="date" class="event-date"></sl-input>
                    </label>
                    <label>
                        <strong>Location:</strong>
                        <sl-input type="text" class="event-location" placeholder="Event Location"></sl-input>
                    </label>
                </div>

                <!-- Right Form: Invitees Emails -->
                <div class="invitees-form">
                    <h2>Invitees</h2>
                    <label>
                        <strong>Enter Emails (separate by commas):</strong>
                        <sl-textarea class="invitees-emails" placeholder="email@example.com"></sl-textarea>
                    </label>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-buttons">
                <sl-button variant="primary" class="create-event-btn">Create Event</sl-button>
                <sl-button variant="secondary" class="cancel-btn">Cancel</sl-button>
            </div>
        </div>
    </div>
    `;

    // Add event listeners for buttons
    document.querySelector('.create-event-btn').addEventListener('click', async () => {
        const eventDetails = {
            title: document.querySelector('.event-title').value,
            description: document.querySelector('.event-description').value,
            date: document.querySelector('.event-date').value,
            location: document.querySelector('.event-location').value,
            invitees: document.querySelector('.invitees-emails').value.split(',').map(email => email.trim())
        };

        await createEvent(eventDetails);
    });

    document.querySelector('.cancel-btn').addEventListener('click', () => {
        const navigateEvent = new CustomEvent('navigate', {
            detail: { page: 'dashboard' },
        });
        document.dispatchEvent(navigateEvent);
    });

    async function createEvent(eventDetails) {
        try {
            const response = await fetch(`${url}events/create`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventDetails),
            });

            if (!response.ok) {
                console.error('Failed to create event:', response.statusText);
                alert('Failed to create event. Please try again.');
                return;
            }

            alert('Event created successfully!');
            const navigateEvent = new CustomEvent('navigate', {
                detail: { page: 'dashboard' },
            });
            document.dispatchEvent(navigateEvent);
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event. Please try again.');
        }
    }
}