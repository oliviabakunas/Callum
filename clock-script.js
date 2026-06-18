// Time zone data
const timeZones = {
    'ny': { name: 'New York', timezone: 'America/New_York', id: 'clock-ny', dateId: 'date-ny' },
    'london': { name: 'London', timezone: 'Europe/London', id: 'clock-london', dateId: 'date-london' },
    'paris': { name: 'Paris', timezone: 'Europe/Paris', id: 'clock-paris', dateId: 'date-paris' },
    'tokyo': { name: 'Tokyo', timezone: 'Asia/Tokyo', id: 'clock-tokyo', dateId: 'date-tokyo' },
    'sydney': { name: 'Sydney', timezone: 'Australia/Sydney', id: 'clock-sydney', dateId: 'date-sydney' },
    'dubai': { name: 'Dubai', timezone: 'Asia/Dubai', id: 'clock-dubai', dateId: 'date-dubai' },
    'singapore': { name: 'Singapore', timezone: 'Asia/Singapore', id: 'clock-singapore', dateId: 'date-singapore' },
    'la': { name: 'Los Angeles', timezone: 'America/Los_Angeles', id: 'clock-la', dateId: 'date-la' },
    'toronto': { name: 'Toronto', timezone: 'America/Toronto', id: 'clock-toronto', dateId: 'date-toronto' }
};

// Format time with leading zeros
function formatTime(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update clock for a specific timezone
function updateClock(key) {
    const tzData = timeZones[key];
    const clockElement = document.getElementById(tzData.id);
    const dateElement = document.getElementById(tzData.dateId);
    
    if (!clockElement) return;

    // Get current time in the specified timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tzData.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    const second = parts.find(p => p.type === 'second').value;

    // Update time display
    const timeString = formatTime(hour, minute, second);
    
    // Add pulse animation
    clockElement.classList.remove('updating');
    void clockElement.offsetWidth; // Trigger reflow
    clockElement.classList.add('updating');
    
    clockElement.textContent = timeString;

    // Update date display
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tzData.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    if (dateElement) {
        dateElement.textContent = dateFormatter.format(now);
    }
}

// Update all clocks
function updateAllClocks() {
    Object.keys(timeZones).forEach(key => updateClock(key));
}

// Initialize clocks
function initializeClocks() {
    updateAllClocks();
    // Update every second
    setInterval(updateAllClocks, 1000);
}

// Add new timezone to the display
function addNewTimezone() {
    const availableTimezones = [
        { name: 'Mumbai', timezone: 'Asia/Kolkata' },
        { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
        { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
        { name: 'Bangkok', timezone: 'Asia/Bangkok' },
        { name: 'Istanbul', timezone: 'Europe/Istanbul' },
        { name: 'Mexico City', timezone: 'America/Mexico_City' },
        { name: 'Seoul', timezone: 'Asia/Seoul' },
        { name: 'Moscow', timezone: 'Europe/Moscow' },
        { name: 'Bangkok', timezone: 'Asia/Bangkok' },
        { name: 'Berlin', timezone: 'Europe/Berlin' }
    ];

    const userSelection = prompt('Enter timezone name (e.g., Mumbai, São Paulo, Hong Kong):');
    
    if (!userSelection) return;

    const selected = availableTimezones.find(tz => 
        tz.name.toLowerCase() === userSelection.toLowerCase()
    );

    if (!selected) {
        alert('Timezone not found. Try one of: ' + availableTimezones.map(t => t.name).join(', '));
        return;
    }

    // Create a unique key
    const key = selected.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if already exists
    if (timeZones[key]) {
        alert('This timezone is already displayed!');
        return;
    }

    // Add to timeZones object
    timeZones[key] = {
        name: selected.name,
        timezone: selected.timezone,
        id: `clock-${key}`,
        dateId: `date-${key}`
    };

    // Create clock card
    const clocksGrid = document.querySelector('.clocks-grid');
    const newCard = document.createElement('div');
    newCard.className = 'clock-card';
    newCard.innerHTML = `
        <div class="clock-header">
            <h2>${selected.name}</h2>
            <span class="timezone">(${selected.timezone})</span>
        </div>
        <div class="clock-display" id="clock-${key}">00:00:00</div>
        <p class="date" id="date-${key}"></p>
    `;

    clocksGrid.appendChild(newCard);

    // Update the new clock
    updateClock(key);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeClocks();
    
    const addBtn = document.getElementById('add-timezone-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addNewTimezone);
    }
});
