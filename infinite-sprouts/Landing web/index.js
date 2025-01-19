document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggleSwitch = document.querySelector('.theme-toggle_switch');
    const body = document.body;

    // Apply initial theme based on localStorage or default to dark
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
    }

    // Toggle theme on switch click
    themeToggleSwitch.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');

        // Update localStorage with the current theme
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    // Active Navbar Links Using Intersection Observer
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Function to remove active class from all links
    function removeActiveClasses() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    // Intersection Observer callback to handle section visibility
    const observer = new IntersectionObserver((entries) => {
        let mostVisibleEntry = null;
        entries.forEach(entry => {
            if (entry.isIntersecting && (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio)) {
                mostVisibleEntry = entry;
            }
        });

        if (mostVisibleEntry) {
            removeActiveClasses();
            const id = mostVisibleEntry.target.getAttribute('id');
            document.querySelector(`.nav-link[href="#${id}"]`).classList.add('active');
        }
    }, { threshold: [0.25, 0.5, 0.75, 1] });

    // Observe each section
    sections.forEach(section => observer.observe(section));

    // Active Status Based on URL for Initial Load
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.href.includes(currentPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }

        // Smooth scroll to section on click
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor click behavior
            const targetId = this.getAttribute('href'); // Get the target section ID
            const targetSection = document.querySelector(targetId); // Select the target section

            if (targetSection) {
                // Smooth scroll to the target section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Footer Subscribe Button
    const subscribeButton = document.getElementById("subscribe-button");
    const emailInput = document.getElementById("email-input");

    subscribeButton.addEventListener("click", function() {
        const email = emailInput.value;

        if (validateEmail(email)) {
            console.log("Email subscribed:", email);
            alert("Thank you for subscribing!"); // Replace with subscription logic
            emailInput.value = ""; // Clear input field
        } else {
            alert("Please enter a valid email address.");
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const dashboardButton = document.getElementById('dashboard-button');
    const closeButton = document.getElementById('close-popup');

    // Show the popup when the Dashboard button is clicked
    dashboardButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action
        popup.style.display = 'flex'; // Show the popup
    });

    // Close the popup when the close button is clicked
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none'; // Hide the popup
    });

    // Optional: Close the popup when clicking outside of the content
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none'; // Hide the popup
        }
    });
});
