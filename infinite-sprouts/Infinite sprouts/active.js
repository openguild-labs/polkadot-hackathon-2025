document.addEventListener('DOMContentLoaded', () => {
    // Get the current URL (full path)
    const currentUrl = window.location.pathname;

    // Select all navigation links (anchor <a> tags)
    const navLinks = document.querySelectorAll('.nav-links li a');

    // Loop through each <a> tag
    navLinks.forEach(link => {
        // Get the href attribute of the link (relative path)
        const linkUrl = link.getAttribute('href');

        // Check if the current URL matches the link URL (adjusted for relative paths)
        if (currentUrl.includes(linkUrl) && linkUrl !== '#') {
            link.classList.add('active'); // Add active class to <a> tag
        } else {
            link.classList.remove('active'); // Remove active class from <a> tag
        }
    });

    // Add click event listeners to update active class dynamically if needed
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to clicked link
            link.classList.add('active');
        });
    });
});
