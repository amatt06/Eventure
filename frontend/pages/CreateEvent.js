const url = 'http://localhost:5000/';

export async function renderCreateEventPage(root) {
    root.innerHTML = `
    <div class="create-event-page">
        <h2>Create a New Event</h2>
        <form class="create-event-form">
            <sl-input label="Event Title" name="title" placeholder="Enter event title" required></sl-input>
            <sl-textarea label="Event Description" name="description" placeholder="Enter event description"></sl-textarea>
            <sl-input label="Event Date" name="date" type="date" required></sl-input>
            <sl-input label="Event Time" name="time" type="time" required></sl-input>
            <sl-input label="Event Location" name="location" placeholder="Enter event location" required></sl-input>
            <sl-textarea label="Invitees (optional)" name="invitees" placeholder="Comma-separated emails"></sl-textarea>
            <sl-button type="submit" variant="primary">Create Event</sl-button>
        </form>
    </div>
    `;

    const form = document.querySelector('.create-event-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const eventDetails = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            invitees: formData.get('invitees')?.split(',').map((email) => email.trim()) || [],
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${url}events/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(eventDetails),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            alert('Event created successfully!');
            window.location.href = '/dashboard'; // Redirect back to dashboard
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    });
}