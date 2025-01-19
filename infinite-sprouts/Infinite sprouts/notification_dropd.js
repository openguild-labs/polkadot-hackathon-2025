// notification_drop.js

document.addEventListener('DOMContentLoaded', () => {
    // === Notification Elements ===
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    // === Notification Filter Buttons ===
    const filterButtons = notificationDropdown.querySelectorAll('.order-filter');
    
    // === Notifications Groups ===
    const notificationsGroups = notificationDropdown.querySelectorAll('.notifications-group');

    // === Initialize Notification Dropdown Functionality ===
    initializeNotificationDropdown();

    /**
     * Initializes the notification dropdown by setting up event listeners.
     */
    function initializeNotificationDropdown() {
        // Toggle dropdown visibility when notification icon is clicked
        notificationIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling up to window
            toggleDropdown(notificationDropdown);
        });

        // Add event listeners to all notification filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-type');
                activateNotificationFilter(button, type);
            });
        });

        // Close dropdown when clicking outside of it
        window.addEventListener('click', (event) => {
            if (!notificationDropdown.contains(event.target) && event.target !== notificationIcon) {
                notificationDropdown.classList.add('hidden');
            }
        });

        // Optional: Close dropdown when pressing the Escape key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                notificationDropdown.classList.add('hidden');
            }
        });

        // Set default active filters on page load
        setDefaultActiveFilters();
    }

    /**
     * Toggles the visibility of a dropdown element.
     * @param {HTMLElement} dropdown - The dropdown element to toggle.
     */
    function toggleDropdown(dropdown) {
        dropdown.classList.toggle('hidden');
    }

    /**
     * Activates a notification filter button and displays corresponding notifications.
     * @param {HTMLElement} button - The filter button that was clicked.
     * @param {string} type - The data-type of the filter.
     */
    function activateNotificationFilter(button, type) {
        // Remove 'active' class from all filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked filter button
        button.classList.add('active');

        // Hide all notifications groups
        notificationsGroups.forEach(group => group.classList.add('hidden'));

        // Show the notifications group that matches the filter's data-type
        const selectedGroup = notificationDropdown.querySelector(`.notifications-group[data-type="${type}"]`);
        if (selectedGroup) {
            selectedGroup.classList.remove('hidden');
        }

        // Optionally, close the dropdown after selecting a filter for a cleaner UX
        notificationDropdown.classList.add('hidden');
    }

    /**
     * Sets default active filters on page load based on elements with 'notif_filter_active' class.
     */
    function setDefaultActiveFilters() {
        const defaultActiveButtons = notificationDropdown.querySelectorAll('.order-filter.notif_filter_active');

        defaultActiveButtons.forEach(button => {
            const type = button.getAttribute('data-type');
            activateNotificationFilter(button, type);
        });
    }
});
