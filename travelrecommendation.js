const apiURL = 'travelrecommendation.json';
const fallbackData = {
    countries: [
        {
            id: 1,
            name: 'Australia',
            cities: [
                {
                    name: 'Sydney, Australia',
                    imageUrl: 'https://cdn.pixabay.com/photo/2014/05/26/09/58/sydney-opera-house-354375_640.jpg',
                    description: 'A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.'
                },
                {
                    name: 'Melbourne, Australia',
                    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/29/14/54/melbourne-2986345_640.jpg',
                    description: 'A cultural hub famous for its art, food, and diverse neighborhoods.'
                }
            ]
        },
        {
            id: 2,
            name: 'Japan',
            cities: [
                {
                    name: 'Tokyo, Japan',
                    imageUrl: 'https://cdn.pixabay.com/photo/2020/10/18/13/47/tokyo-tower-5664846_640.jpg',
                    description: 'A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture.'
                },
                {
                    name: 'Kyoto, Japan',
                    imageUrl: 'https://cdn.pixabay.com/photo/2016/06/18/03/59/ginkaku-ji-temple-1464542_640.jpg',
                    description: 'Known for its historic temples, gardens, and traditional tea houses.'
                }
            ]
        },
        {
            id: 3,
            name: 'Brazil',
            cities: [
                {
                    name: 'Rio de Janeiro, Brazil',
                    imageUrl: 'https://cdn.pixabay.com/photo/2015/06/14/23/35/rio-de-janeiro-809756_640.jpg',
                    description: 'A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks.'
                },
                {
                    name: 'Sao Paulo, Brazil',
                    imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/architecture-1867187_640.jpg',
                    description: 'The financial hub with diverse culture, arts, and a vibrant nightlife.'
                }
            ]
        }
    ],
    temples: [
        {
            id: 1,
            name: 'Angkor Wat, Cambodia',
            imageUrl: 'https://cdn.pixabay.com/photo/2017/06/09/19/56/ta-prohm-2388126_640.jpg',
            description: 'A UNESCO World Heritage site and the largest religious monument in the world.'
        },
        {
            id: 2,
            name: 'Taj Mahal, India',
            imageUrl: 'https://cdn.pixabay.com/photo/2020/06/05/21/09/cultural-tourism-5264542_640.jpg',
            description: 'An iconic symbol of love and a masterpiece of Mughal architecture.'
        }
    ],
    beaches: [
        {
            id: 1,
            name: 'Bora Bora, French Polynesia',
            imageUrl: 'https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704_640.jpg',
            description: 'An island known for its stunning turquoise waters and luxurious overwater bungalows.'
        },
        {
            id: 2,
            name: 'Copacabana Beach, Brazil',
            imageUrl: 'https://images.unsplash.com/photo-1596573677494-accc8fbe89e8?q=80&w=1000&auto=format&fit=crop',
            description: 'A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and scenic views.'
        }
    ]
};
const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>" +
        "<rect width='800' height='500' fill='#0a5d66'/>" +
        "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#ffffff' font-family='Arial, sans-serif' font-size='36'>" +
        "Image unavailable" +
        "</text>" +
        "</svg>"
    );

function loadRecommendations() {
    return fetch(apiURL)
        .then(response => {

            if (!response.ok) {
                throw new Error('Failed to fetch JSON data');
            }

            return response.json();
        })
        .catch(error => {
            console.error('Using fallback recommendation data:', error);
            return fallbackData;
        });
}

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

    const searchInput = document.querySelector('.searchinput');
    const resultsContainer = document.getElementById('resultContainer');
    const dropdown = document.getElementById('dropdown');

    if (!searchInput || !resultsContainer || !dropdown) {
        return;
    }

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        dropdown.style.display = 'block';
        resultsContainer.innerHTML = `
            <p style="color:white; text-align:center;">
                Please type a keyword to search.
            </p>
        `;
        return;
    }

    loadRecommendations()
        .then(data => {
            dropdown.style.display = 'block';
            processQuery(data, keyword);
        })

        .catch(error => {

            console.error(error);
            dropdown.style.display = 'block';

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

    const resultsContainer = document.getElementById('resultContainer');

    if (!resultsContainer) {
        return;
    }

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

        const cardImage = card.querySelector('img');

        if (cardImage) {
            cardImage.addEventListener('error', () => {
                cardImage.src = fallbackImage;
            }, { once: true });
        }

        resultsContainer.appendChild(card);

    });
}

// Clear Results
function clearDisplay() {
    const resultsContainer = document.getElementById('resultContainer');

    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('.searchinput');
    const searchBtn = document.getElementById('searchbtn');
    const resetBtn = document.getElementById('clearbtn');
    const closeBtn = document.getElementById('close-btn');
    const contactForm = document.getElementById('contactForm');
    const dropdown = document.getElementById('dropdown');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {

            if (e.key === 'Enter') {
                performSearch();
            }

        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {

            if (searchInput) {
                searchInput.value = '';
            }

            clearDisplay();

            if (dropdown) {
                dropdown.style.display = 'none';
            }

        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.alert('Your message has been submitted successfully.');
            contactForm.reset();
        });
    }
});
