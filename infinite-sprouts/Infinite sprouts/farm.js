// Select buttons and sections
const dataButton = document.getElementById('dataButton');
const statisticsButton = document.getElementById('statisticsButton');
const showStatisticsButton = document.getElementById('showStatisticsButton');
const cardsContainer = document.getElementById('cardsContainer');
const statisticsSection = document.getElementById('statisticsSection');
const preStatistics = document.querySelector('.pre-statistics');

// Select canvas elements for the charts
const ctx1 = document.getElementById('statsChart').getContext('2d');
const ctx2 = document.getElementById('monthlyChart').getContext('2d');

// Function to show only one section at a time
function showSection(section) {
    cardsContainer.style.display = 'none';
    statisticsSection.style.display = 'none';
    preStatistics.style.display = 'none';
    section.style.display = 'block';
}

// Function to set active button styling
function setActiveButton(activeButton) {
    dataButton.classList.remove('active');
    statisticsButton.classList.remove('active');
    showStatisticsButton.classList.remove('active');
    activeButton.classList.add('active');
}

// Event listeners for button clicks
dataButton.addEventListener('click', () => {
    showSection(cardsContainer);
    setActiveButton(dataButton);
});

statisticsButton.addEventListener('click', () => {
    showSection(statisticsSection);
    setActiveButton(statisticsButton);
    renderCharts(); // Render charts when statistics section is shown
});

showStatisticsButton.addEventListener('click', () => {
    showSection(preStatistics);
    setActiveButton(showStatisticsButton);
});

// Initialize with cards section visible
showSection(cardsContainer);

// Function to render the charts with lime accents
function renderCharts() {
    // Data for the Top 25 Agriculture Countries (Bar Chart)
    const agricultureData = {
        labels: ['China', 'India', 'United States', 'Brazil', 'Indonesia', 'Russia', 'Mexico', 'Pakistan', 'Nigeria', 'Japan', 'Turkey', 'Vietnam', 'Thailand', 'Germany', 'France', 'Italy', 'Argentina', 'South Korea', 'Canada', 'Egypt', 'Malaysia', 'Philippines', 'Bangladesh', 'Ukraine', 'Colombia', 'Sudan'],
        datasets: [{
            label: 'Top 25 Agriculture Countries',
            data: [243, 198, 185, 175, 160, 120, 115, 105, 100, 90, 85, 80, 70, 65, 60, 58, 55, 52, 50, 48, 45, 42, 40, 38, 35],
            backgroundColor: 'rgba(200, 255, 0, 0.4)',  // Lime color for bar fill
            borderColor: '#c8ff00',  // Lime color for bar borders
            borderWidth: 2
        }]
    };

    // Data for Monthly Agriculture Data (Line Chart)
    const monthlyAgricultureData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Monthly Agriculture Data',
            data: [150, 170, 130, 180, 190, 210, 220, 250, 240, 230, 210, 200],
            backgroundColor: 'rgba(200, 255, 0, 0.2)', // Lime color with opacity for line area fill
            borderColor: '#c8ff00', // Lime color for line
            pointBackgroundColor: '#c8ff00', // Lime color for points
            pointBorderColor: '#c8ff00', // Lime color for point borders
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    };

    // Render the bar chart for Top 25 Agriculture Countries
    new Chart(ctx1, {
        type: 'bar',
        data: agricultureData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#c8ff00' // Lime color for legend text
                    }
                },
                tooltip: {
                    backgroundColor: '#333333', // Dark background for tooltips
                    titleColor: '#c8ff00', // Lime title color
                    bodyColor: '#e0e0e0', // Light color for body text
                    borderColor: '#c8ff00',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#c8ff00' // Lime color for x-axis labels
                    },
                    grid: {
                        color: '#444444' // Darker grid color
                    }
                },
                y: {
                    ticks: {
                        color: '#c8ff00' // Lime color for y-axis labels
                    },
                    grid: {
                        color: '#444444'
                    }
                }
            }
        }
    });

    // Render the line chart for Monthly Agriculture Data
    new Chart(ctx2, {
        type: 'line',
        data: monthlyAgricultureData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#c8ff00' // Lime color for legend text
                    }
                },
                tooltip: {
                    backgroundColor: '#333333',
                    titleColor: '#c8ff00',
                    bodyColor: '#e0e0e0',
                    borderColor: '#c8ff00',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#c8ff00'
                    },
                    grid: {
                        color: '#444444'
                    }
                },
                y: {
                    ticks: {
                        color: '#c8ff00'
                    },
                    grid: {
                        color: '#444444'
                    }
                }
            }
        }
    });
}

// Example API URLs for weather, market prices, yield updates, and disease updates
const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY';
const marketPriceAPI = 'https://api.example.com/market-prices'; // Replace with a real API endpoint
const yieldAPI = 'https://api.example.com/yield-updates'; // Replace with a real API endpoint
const diseaseAPI = 'https://api.example.com/disease-updates'; // Replace with a real API endpoint

// Function to fetch and display the weather data
async function fetchWeather() {
    try {
        const response = await fetch(weatherAPI);
        const data = await response.json();
        const weatherInfo = `Temp: ${data.main.temp}°C, Condition: ${data.weather[0].description}`;
        document.getElementById('weatherInfo').textContent = weatherInfo;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherInfo').textContent = 'Failed to load weather data.';
    }
}

// Function to fetch and display market prices for different crops
async function fetchMarketPrices() {
    try {
        const response = await fetch(marketPriceAPI);
        const data = await response.json();
        let pricesHTML = '';
        data.prices.forEach((item) => {
            pricesHTML += `<li>${item.crop}: $${item.price}</li>`;
        });
        document.getElementById('marketPrices').innerHTML = pricesHTML;
    } catch (error) {
        console.error('Error fetching market prices:', error);
        document.getElementById('marketPrices').innerHTML = '<li>Failed to load market prices.</li>';
    }
}

// Function to fetch and display yield updates
async function fetchYieldUpdates() {
    try {
        const response = await fetch(yieldAPI);
        const data = await response.json();
        document.getElementById('yieldInfo').textContent = `Current yield estimate: ${data.estimate} tons/ha`;
    } catch (error) {
        console.error('Error fetching yield data:', error);
        document.getElementById('yieldInfo').textContent = 'Failed to load yield updates.';
    }
}

// Function to fetch and display disease updates
async function fetchDiseaseUpdates() {
    try {
        const response = await fetch(diseaseAPI);
        const data = await response.json();
        document.getElementById('diseaseInfo').textContent = `Latest disease alert: ${data.alert}`;
    } catch (error) {
        console.error('Error fetching disease updates:', error);
        document.getElementById('diseaseInfo').textContent = 'Failed to load disease updates.';
    }
}

// Function to update all cards daily
function updateDailyData() {
    fetchWeather();
    fetchMarketPrices();
    fetchYieldUpdates();
    fetchDiseaseUpdates();
}

// Call the function to update the data when the page loads
updateDailyData();

// Set an interval to fetch data every 24 hours (86400000 ms)
setInterval(updateDailyData, 86400000); // Update every 24 hours


// Select all update cards
const updateCards = document.querySelectorAll('.update-card');

// Function to toggle expand/collapse on click
function toggleCardExpansion(card) {
    // Toggle the 'expanded' class
    card.classList.toggle('expanded');
}

// Add event listeners to each card to toggle expansion on click
updateCards.forEach(card => {
    card.addEventListener('click', () => {
        toggleCardExpansion(card);
    });
});

// Function to fetch and display the weather data (or other data types)
async function fetchWeather() {
    try {
        const response = await fetch(weatherAPI);
        const data = await response.json();
        const weatherInfo = `Temp: ${data.main.temp}°C, Condition: ${data.weather[0].description}`;
        document.getElementById('weatherInfo').textContent = weatherInfo;
        document.getElementById('weatherDetails').textContent = `Detailed weather info: ${data.weather[0].description}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherInfo').textContent = 'Failed to load weather data.';
    }
}

// Fetch data on page load
fetchWeather();


Chart.defaults.color = '#c8ff00'; // Set default text color to lime
Chart.defaults.borderColor = '#c8ff00'; // Set default grid line color to dark grey

