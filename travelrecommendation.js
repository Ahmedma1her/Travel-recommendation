// Task 6/7/9 DOM Element Selectors
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.btn-search');
const resetBtn = document.querySelector('.btn-reset'); // Task 2 Reset Element
const resultsContainer = document.getElementById('results-container');

const apiURL = 'travel_recommendation_api.json';

// Task 10 Time-zone registry mapping dataset cities to operational tz names
const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Kyoto",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

// Main Fetch Execution
function performSearch() {
    // Task 7: String modification converts queries completely to lowercase
    const keyword = searchInput.value.trim().toLowerCase();
    
    if (!keyword) {
        resultsContainer.innerHTML = '<p style="color: #fff; text-align: center;">Please type a keyword to search.</p>';
        return;
    }

    fetch(apiURL)
        .then(response => {
            if (!response.ok) throw new Error('API Data could not be read.');
            return response.json();
        })
        .then(data => {
            console.log("Data context initialized:", data);
            processQuery(data, keyword);
        })
        .catch(error => {
            console.error('Error fetching context:', error);
            resultsContainer.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Error fetching recommendation data.</p>';
        });
}

// Task 7 & 8: Filter routing matrix
function processQuery(data, keyword) {
    // Task 9 Clear function resets screen dynamically prior to formatting content
    clearDisplay();
    
    let matches = [];

    // Task 7 Variation handling configurations ("beach", "beaches", "BEACH", etc)
    if (keyword === 'beach' || keyword === 'beaches') {
        matches = data.beaches;
    } 
    // Task 7 Variation handling configurations ("temple", "temples", "TEMPLE", etc)
    else if (keyword === 'temple' || keyword === 'temples') {
        matches = data.temples;
    } 
    // Task 7 Variation handling configurations ("country", "countries", "COUNTRY", etc)
    else if (keyword === 'country' || keyword === 'countries') {
        // Collects at least 2 default cities across listed regions
        data.countries.forEach(country => matches.push(...country.cities));
    } 
    // Manual fallbacks evaluating custom values matching explicitly (e.g. "japan", "brazil")
    else {
        const directCountryMatch = data.countries.find(c => c.name.toLowerCase() === keyword);
        if (directCountryMatch) {
            matches = directCountryMatch.cities;
        } else {
            // Check direct structural strings
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) matches.push(city);
                });
            });
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(keyword)) matches.push(temple);
            });
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(keyword)) matches.push(beach);
            });
        }
    }

    renderCards(matches);
}

// Task 8 & 10: Dynamic Template Rendering Engine 
function renderCards(places) {
    if (places.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #fff; text-align: center; grid-column: 1/-1;">No records found matching your keyword criteria.</p>';
        return;
    }

    places.forEach(place => {
        // Fallback checks standardizing local filenames to functional, production-ready CDN imagery
        let finalImg = place.imageUrl;
        if (place.imageUrl.includes('enter_your_image') || place.imageUrl === "") {
            finalImg = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop`;
        }

        // Task 10 Logic: Compute specific geographic local time on-demand
        let localTimeStr = "Local time unavailable";
        const tzZone = timeZones[place.name];
        
        if (tzZone) {
            try {
                const options = { 
                    timeZone: tzZone, 
                    hour12: true, 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    second: 'numeric' 
                };
                localTimeStr = `Local Time: ${new Date().toLocaleTimeString('en-US', options)}`;
            } catch (e) {
                console.error("Time generation failure for timezone zone string:", tzZone, e);
            }
        }

        // Building the component injection layouts with strict CSS Grid styling structure
        const card = document.createElement('div');
        card.classList.add('result-card');
        card.innerHTML = `
            <img src="${finalImg}" alt="${place.name}">
            <div class="result-card-content">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <div class="time-badge">${localTimeStr}</div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Task 9: Distinct functional encapsulation to clear state
function clearDisplay() {
    resultsContainer.innerHTML = '';
}

// Action Event Observers
searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Reset Button handling click commands
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearDisplay();
    console.log("Display state cleanly reset.");
});
