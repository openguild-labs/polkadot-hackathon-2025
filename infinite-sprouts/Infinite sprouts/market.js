document.addEventListener("DOMContentLoaded", () => {
    // Initially display the DM Section
    switchSection('dmSection');

    // Handle Accept/Reject for Message Requests and Friend Requests
    document.querySelectorAll('.accept').forEach(button => {
        button.addEventListener('click', handleAccept);
    });

    document.querySelectorAll('.reject').forEach(button => {
        button.addEventListener('click', handleReject);
    });
});

// Switch between sections
function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('visible'));

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show the selected section
    document.getElementById(sectionId).classList.add('visible');

    // Add active class to the clicked tab
    const activeTab = document.querySelector(`.tab[onclick="switchSection('${sectionId}')"]`);
    activeTab.classList.add('active');
}

// Handle Accept button click
function handleAccept(event) {
    const requestItem = event.target.closest('.request-item');
    requestItem.querySelector('.request-actions').innerHTML = '<span class="status">Accepted</span>';
    requestItem.querySelector('.status').style.color = 'limegreen';
    event.target.disabled = true;
    event.target.nextElementSibling.disabled = true;
}

// Handle Reject button click
function handleReject(event) {
    const requestItem = event.target.closest('.request-item');
    requestItem.querySelector('.request-actions').innerHTML = '<span class="status">Rejected</span>';
    requestItem.querySelector('.status').style.color = 'red';
    event.target.disabled = true;
    event.target.previousElementSibling.disabled = true;
}

// Automatically set up event listeners for Accept/Reject buttons when the page loads
function setupButtons() {
    document.querySelectorAll('.accept').forEach(button => {
        button.addEventListener('click', handleAccept);
    });
    document.querySelectorAll('.reject').forEach(button => {
        button.addEventListener('click', handleReject);
    });
}

// Initialize Accept/Reject buttons for dynamic content
setupButtons();



function showSection(sectionId) {
    // Get all sections and header buttons
    const sections = document.querySelectorAll(".center_content.section");
    const buttons = document.querySelectorAll(".header-button");

    // Loop through all sections to hide them
    sections.forEach((section) => {
        section.classList.add("hidden");
        section.classList.remove("active");
    });

    // Loop through buttons to remove active class
    buttons.forEach((button) => {
        button.classList.remove("active");
    });

    // Display the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove("hidden");
        selectedSection.classList.add("active");
    }

    // Highlight the corresponding button
    const selectedButton = document.querySelector(`#btn${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}


// Function to filter history based on type
function filterHistory(type) {
    // Select all history rows and buttons
    const rows = document.querySelectorAll('.history-row');
    const buttons = document.querySelectorAll('.history-sub-button');

    // Update active button styling
    buttons.forEach((button) => {
        if (button.textContent.toLowerCase() === type.toLowerCase() || (type === 'all' && button.textContent === 'ALL')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Show/hide rows based on type
    rows.forEach((row) => {
        const rowType = row.getAttribute('data-type');
        if (type === 'all' || rowType === type) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });

    // Handle placeholder visibility
    const visibleRows = Array.from(rows).filter(row => !row.classList.contains('hidden'));
    const placeholder = document.querySelector('.placeholder-row');
    if (visibleRows.length === 0) {
        placeholder.classList.remove('hidden');
    } else {
        placeholder.classList.add('hidden');
    }
}

// Initialize with all rows visible
document.addEventListener('DOMContentLoaded', () => {
    filterHistory('all'); // Default filter to show all history rows
});
