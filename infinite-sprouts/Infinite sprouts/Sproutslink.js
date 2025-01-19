document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    // Dropdown toggle functionality
    function setupDropdown(triggerId, dropdownId, closeId) {
        const trigger = document.getElementById(triggerId);
        const dropdown = document.getElementById(dropdownId);
        const closeButton = document.getElementById(closeId);

        if (trigger && dropdown && closeButton) {
            trigger.addEventListener("click", () => {
                dropdown.classList.toggle("active");
            });

            closeButton.addEventListener("click", () => {
                dropdown.classList.remove("active");
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
                if (!dropdown.contains(e.target) && e.target !== trigger) {
                    dropdown.classList.remove("active");
                }
            });
        } else {
            console.error(`Missing elements for dropdown: ${triggerId}, ${dropdownId}, ${closeId}`);
        }
    }

    // Initialize dropdowns
    setupDropdown("notificationIcon", "notificationDropdown", "closeNotifications");
    setupDropdown("supportIcon", "supportDropdown", "closeSupport");
    setupDropdown("notepadIcon", "notepadDropdown", "closeNotepad");

    // Section switching functionality
    function setupSectionSwitching(buttonSelector, sectionIds) {
        const buttons = document.querySelectorAll(buttonSelector);

        if (buttons.length > 0) {
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    // Set active class for buttons
                    buttons.forEach((btn) => btn.classList.remove("active"));
                    button.classList.add("active");

                    // Show the corresponding section
                    sectionIds.forEach((sectionId) => {
                        const section = document.getElementById(sectionId);
                        if (section) {
                            section.classList.remove("active");
                        }
                    });

                    const targetSection = document.getElementById(
                        button.id.replace("Btn", "Section")
                    );
                    if (targetSection) {
                        targetSection.classList.add("active");
                    } else {
                        console.error(`No section found for button: ${button.id}`);
                    }
                });
            });
        } else {
            console.error(`No buttons found for selector: ${buttonSelector}`);
        }
    }

    // Initialize section switching
    setupSectionSwitching(".sub_heading_btn", [
        "feedsSection",
        "communitiesSection",
        "emcHubSection",
    ]);

    // Social post filters
    setupSectionSwitching(".social_btn", [
        "allPosts",
        "agriculturePosts",
        "cryptoPosts",
        "politicsPosts",
    ]);

    console.log("Initialization complete!");
});



const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('sidebarToggle');

        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            const icon = toggleButton.querySelector('i');
            if (sidebar.classList.contains('closed')) {
                icon.classList.remove('fa-arrow-left');
                icon.classList.add('fa-arrow-right');
            } else {
                icon.classList.remove('fa-arrow-right');
                icon.classList.add('fa-arrow-left');
            }
        });