// Data for the charts
const totalGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Total Growth Rate (%)',
        data: [10, 20, 30, 25, 40, 50, 60, 55, 70, 85, 90, 100],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true
    }]
};

const stakingGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Staking/Investment Growth Rate (%)',
        data: [5, 15, 20, 18, 25, 35, 45, 48, 60, 70, 78, 85],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: true
    }]
};

// Chart options for dark theme
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: '#ffffff' // White color for legend text
            }
        }
    },
    scales: {
        x: {
            ticks: { color: '#b0b0b0' }, // Light color for x-axis labels
            grid: { color: 'rgba(255, 255, 255, 0.1)' } // Faint grid color
        },
        y: {
            beginAtZero: true,
            ticks: { color: '#b0b0b0' }, // Light color for y-axis labels
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            title: {
                display: true,
                text: 'Growth Rate (%)',
                color: '#ffffff'
            }
        }
    }
};

// Render the "Total Growth" chart
new Chart(document.getElementById('totalGrowthChart').getContext('2d'), {
    type: 'line',
    data: totalGrowthData,
    options: chartOptions
});

// Render the "Staking/Investment Growth" chart
new Chart(document.getElementById('stakingGrowthChart').getContext('2d'), {
    type: 'line',
    data: stakingGrowthData,
    options: chartOptions
});

const trendingContainer = document.querySelector('.trending');
const upArrow = document.querySelector('.up-arrow');
const downArrow = document.querySelector('.down-arrow');

trendingContainer.addEventListener('click', () => {
    trendingContainer.classList.toggle('full-screen');

    // Toggle arrow visibility
    if (trendingContainer.classList.contains('full-screen')) {
        upArrow.style.display = 'none';
        downArrow.style.display = 'inline-block';
    } else {
        upArrow.style.display = 'inline-block';
        downArrow.style.display = 'none';
    }
});
