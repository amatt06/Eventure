import Logo from '../assets/Nav-Logo.svg';

export async function renderDashboard(root) {
    const url = 'http://localhost:5000/';
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    const accessLevel = localStorage.getItem('accessLevel'); // Access level (organizer or attendee)

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
                    ${accessLevel > 0 ? '<sl-button variant="primary" class="create-event">+</sl-button>' : ''}
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
                    <h2 class="event-title">Select an event</h2>
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
            displayEventDetails(eventDetails, userEmail, accessLevel);
        });
    });

    async function fetchUserEvents(token) {
        try {
            const response = await fetch(`${url}events/user`, {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                console.error(`Failed to fetch events: ${response.statusText}`);
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user events:', error);
            return [];
        }
    }

    async function fetchEventDetails(eventId, token) {
        try {
            const response = await fetch(`${url}events/${eventId}`, {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                console.error(`Failed to fetch event details: ${response.statusText}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching event details:', error);
            return null;
        }
    }

    function displayEventDetails(event, userEmail, accessLevel) {
        const eventDetailsDiv = document.querySelector('.event-details');

        if (!event) {
            eventDetailsDiv.innerHTML = `<h2 class="event-title">Event not found</h2>`;
            return;
        }

        const attendeeCount = event.rsvp_responses.length;

        if (accessLevel > 0) {
            // Organizer view with editable event details
            eventDetailsDiv.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p><strong>Attendee Count:</strong> ${attendeeCount}</p>
            <label>
                <strong>Date:</strong>
                <sl-input type="date" class="edit-date" value="${event.date.split('T')[0]}">
            </label>
            <label>
                <strong>Time:</strong>
                <sl-input type="time" class="edit-time" value="${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}">
            </label>
            <label>
                <strong>Location:</strong>
                <sl-input type="text" class="edit-location" value="${event.location}">
            </label>
            <label>
                <strong>Description:</strong>
                <sl-textarea class="edit-description" value="${event.description}"> </sl-textarea>
            </label>
            <sl-button variant="primary" class="update-button">Update</sl-button>
            `;

            document.querySelector('.update-button').addEventListener('click', () => handleUpdateEvent(event._id));
        } else {
            // Attendee view
            const isRSVPd = event.rsvp_responses.some((r) => r.email === userEmail);

            eventDetailsDiv.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <sl-button variant="primary" class="rsvp-button">${isRSVPd ? 'Un-RSVP' : 'RSVP'}</sl-button>
            `;

            const rsvpButton = document.querySelector('.rsvp-button');
            rsvpButton.addEventListener('click', () => {
                if (isRSVPd) handleUnRSVP(event._id, rsvpButton);
                else handleRSVP(event._id, rsvpButton);
            });
        }
    }

    async function handleUpdateEvent(eventId) {
        const updatedEvent = {
            date: document.querySelector('.edit-date').value,
            time: document.querySelector('.edit-time').value,
            location: document.querySelector('.edit-location').value,
            description: document.querySelector('.edit-description').value,
        };

        try {
            const response = await fetch(`${url}events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) throw new Error('Failed to update event.');

            alert('Event details updated successfully!');
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event.');
        }
    }

    async function handleRSVP(eventId, button) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found. Please log in.');
            alert('Please log in to RSVP to this event.');
            return;
        }

        try {
            const response = await fetch(`${url}events/${eventId}/rsvp`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                console.error(`Failed to RSVP: ${response.statusText}`);
                return;
            }

            const data = await response.json();
            console.log('RSVP successful:', data);
            button.textContent = 'Un-RSVP';
            button.onclick = () => handleUnRSVP(eventId, button);
        } catch (error) {
            console.error('Error handling RSVP:', error);
        }
    }

    async function handleUnRSVP(eventId, button) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found. Please log in.');
            alert('Please log in to unRSVP to this event.');
            return;
        }

        try {
            const response = await fetch(`${url}events/${eventId}/unrsvp`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                console.error(`Failed to unRSVP: ${response.statusText}`);
                alert('Failed to unRSVP. Please try again.');
                return;
            }

            const data = await response.json();
            console.log('Un-RSVP successful:', data);
            button.textContent = 'RSVP';
            button.onclick = () => handleRSVP(eventId, button);
        } catch (error) {
            console.error('Error handling unRSVP:', error);
            alert('An error occurred while unRSVP’ing. Please try again.');
        }
    }
}