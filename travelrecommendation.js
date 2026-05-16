// DOM Element Selectors
const searchInput = document.querySelector('.searchinput');
const searchBtn = document.getElementById('searchbtn');
const resetBtn = document.getElementById('clearbtn');
const resultsContainer = document.getElementById('resultContainer');

const apiURL = 'travel_recommendation_api.json';

// Time-zone registry
const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Kyoto",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "Sao Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

// Main Search Function
function performSearch() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        resultsContainer.innerHTML = `
            <p style="color:white; text-align:center;">
                Please type a keyword to search.
            </p>
        `;
        return;
    }

    fetch(apiURL)
        .then(response => {

            if (!response.ok) {
                throw new Error('Failed to fetch JSON data');
            }

            return response.json();
        })

        .then(data => {
            processQuery(data, keyword);
        })

        .catch(error => {

            console.error(error);

            resultsContainer.innerHTML = `
                <p style="color:red; text-align:center;">
                    Error loading recommendation data.
                </p>
            `;
        });
}

// Process Search Query
function processQuery(data, keyword) {

    clearDisplay();

    let matches = [];

    // beaches
    if (keyword === 'beach' || keyword === 'beaches') {
        matches = data.beaches;
    }

    // temples
    else if (keyword === 'temple' || keyword === 'temples') {
        matches = data.temples;
    }

    // countries
    else if (keyword === 'country' || keyword === 'countries') {

        data.countries.forEach(country => {
            matches.push(...country.cities);
        });
    }

    // direct search
    else {

        // country name
        const directCountryMatch = data.countries.find(country =>
            country.name.toLowerCase() === keyword
        );

        if (directCountryMatch) {

            matches = directCountryMatch.cities;

        } else {

            // cities
            data.countries.forEach(country => {

                country.cities.forEach(city => {

                    if (city.name.toLowerCase().includes(keyword)) {
                        matches.push(city);
                    }

                });

            });

            // temples
            data.temples.forEach(temple => {

                if (temple.name.toLowerCase().includes(keyword)) {
                    matches.push(temple);
                }

            });

            // beaches
            data.beaches.forEach(beach => {

                if (beach.name.toLowerCase().includes(keyword)) {
                    matches.push(beach);
                }

            });
        }
    }

    renderCards(matches);
}

// Render Results
function renderCards(places) {

    if (places.length === 0) {

        resultsContainer.innerHTML = `
            <p style="color:white; text-align:center;">
                No results found.
            </p>
        `;

        return;
    }

    places.forEach(place => {

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

                localTimeStr =
                    `Local Time: ${new Date().toLocaleTimeString('en-US', options)}`;

            } catch (error) {

                console.error(error);

            }
        }

        // Card
        const card = document.createElement('div');

        card.classList.add('result-card');

        card.innerHTML = `
            <img 
                src="${place.imageUrl}" 
                alt="${place.name}"
                style="
                    width:100%;
                    height:200px;
                    object-fit:cover;
                    border-radius:10px;
                "
            >

            <div style="padding:10px;">

                <h3>${place.name}</h3>

                <p>${place.description}</p>

                <p style="
                    margin-top:10px;
                    font-weight:bold;
                    color:#00d9ff;
                ">
                    ${localTimeStr}
                </p>

            </div>
        `;

        resultsContainer.appendChild(card);

    });
}

// Clear Results
function clearDisplay() {
    resultsContainer.innerHTML = '';
}

// Search Button
searchBtn.addEventListener('click', performSearch);

// Enter Key
searchInput.addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {
        performSearch();
    }

});

// Reset Button
resetBtn.addEventListener('click', () => {

    searchInput.value = '';

    clearDisplay();

});
