document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const homeBtn = document.getElementById('homeBtn');
    
    // Show sidebar when menu button is clicked
    menuBtn.addEventListener('click', function () {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('open'); // Add the open class to show link text
        menuBtn.style.display = 'none'; // Hide menu button
        closeSidebarBtn.style.display = 'block'; // Show close button
        homeBtn.style.display = 'none'; // Hide home button
    });
    
    // Hide sidebar when close button is clicked
    closeSidebarBtn.addEventListener('click', function () {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('open'); // Remove the open class when closing
        menuBtn.style.display = 'block'; // Show menu button
        closeSidebarBtn.style.display = 'none'; // Hide close button
        homeBtn.style.display = 'block'; // Show home button
    });
    
    // Check screen size and adjust visibility
    function checkScreenSize() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 760) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('open'); // Ensure the open class is removed
            menuBtn.style.display = 'block'; // Ensure menu button is visible at 760px and below
            closeSidebarBtn.style.display = 'none'; // Hide close button
            homeBtn.style.display = 'block'; // Show home button when sidebar is hidden
        } else {
            sidebar.classList.remove('hidden');
            sidebar.classList.remove('open'); // Ensure the open class is removed on larger screens
            homeBtn.style.display = 'none'; // Hide home button on larger screens
            menuBtn.style.display = 'none'; // Hide menu button above 760px unless sidebar is hidden
            closeSidebarBtn.style.display = 'none'; // Hide close button
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check
});

// Toggle visibility of the accounts list
function toggleDropdown() {
        var container = document.getElementById('accounts-container');
        var arrow = document.getElementById('arrow');
        if (container.style.display === "none" || container.style.display === "") {
            container.style.display = "block";
            arrow.innerHTML = "&#9650;"; // Upward arrow
        } else {
            container.style.display = "none";
            arrow.innerHTML = "&#9660;"; // Downward arrow
        }
    }

    // Switch account function
    function switchAccount(accountId, username, imgSrc) {
        // Remove active class from all accounts
        var accounts = document.getElementsByClassName('account');
        for (var i = 0; i < accounts.length; i++) {
            accounts[i].classList.remove('active');
        }
        // Add active class to selected account
        document.getElementById(accountId).classList.add('active');
        
        // Update the dropdown text and image to reflect the active account
        document.getElementById('selected-account-name').innerText = username;
        document.getElementById('selected-account-img').setAttribute('src', imgSrc); // Ensure image src is updated properly

        // Hide the accounts dropdown after selecting
        document.getElementById('accounts-container').style.display = 'none';
        document.getElementById('arrow').innerHTML = "&#9660;"; // Downward arrow
    }

    // Set default active account (Account 1) on page load
    window.onload = function() {
        // Set default account 1 as active
        switchAccount('account1', 'User 1', 'Assets/NFT sneak peak...3.jpg');
    };

    // Function to toggle dropdown visibility
    function toggleDropdown() {
            const accountsContainer = document.getElementById('accountsContainer');
            const overlay = document.getElementById('overlay');

            const isOpen = accountsContainer.style.display === 'block';
            accountsContainer.style.display = isOpen ? 'none' : 'block';
            overlay.style.display = isOpen ? 'none' : 'block'; // Toggle overlay
        }

        // Function to switch account
        function switchAccount(accountId, username, imageSrc) {
            // Update selected account info
            document.getElementById('selectedAccountName').innerText = username;
            document.getElementById('selectedAccountImg').src = imageSrc;

            // Update active account
            const accounts = document.querySelectorAll('.account');
            accounts.forEach(account => {
                account.classList.remove('active');
                account.querySelector('.active-check').style.display = 'none';
            });

            const selectedAccount = document.getElementById(accountId);
            selectedAccount.classList.add('active');
            selectedAccount.querySelector('.active-check').style.display = 'inline'; // Show check for active account

            // Hide dropdown and overlay after selection
            toggleDropdown();
        }

        // Close dropdown if clicked outside
        function closeDropdown() {
            const accountsContainer = document.getElementById('accountsContainer');
            const overlay = document.getElementById('overlay');

            accountsContainer.style.display = 'none';
            overlay.style.display = 'none'; // Hide overlay
        }

        // Close dropdown if clicked outside of account switcher
        document.addEventListener('click', function (event) {
            const dropdown = document.querySelector('.account-dropdown');
            const accountsContainer = document.getElementById('accountsContainer');
            const overlay = document.getElementById('overlay');

            if (!dropdown.contains(event.target) && !accountsContainer.contains(event.target)) {
                closeDropdown();
            }
        });

        
        // Ensure the dropdown is hidden on page load
        window.onload = function() {
            const accountsContainer = document.getElementById('accountsContainer');
            const overlay = document.getElementById('overlay');
            accountsContainer.style.display = 'none'; // Ensure it is hidden on load
            overlay.style.display = 'none'; // Ensure overlay is hidden
        };

        document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const homeBtn = document.getElementById('homeBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay'); // New overlay element

    // Show sidebar and overlay when the menu button is clicked
    menuBtn.addEventListener('click', function () {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('open');
        menuBtn.style.display = 'none';
        closeSidebarBtn.style.display = 'block';
        homeBtn.style.display = 'none';
        sidebarOverlay.style.display = 'block'; // Show overlay
    });

    // Hide sidebar and overlay when the close button is clicked
    closeSidebarBtn.addEventListener('click', function () {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
        closeSidebarBtn.style.display = 'none';
        homeBtn.style.display = 'block';
        sidebarOverlay.style.display = 'none'; // Hide overlay
    });

    // Hide sidebar and overlay when the overlay itself is clicked
    sidebarOverlay.addEventListener('click', function () {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
        closeSidebarBtn.style.display = 'none';
        homeBtn.style.display = 'block';
        sidebarOverlay.style.display = 'none'; // Hide overlay
    });

    // Check screen size and adjust visibility
    function checkScreenSize() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 760) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('open');
            menuBtn.style.display = 'block';
            closeSidebarBtn.style.display = 'none';
            homeBtn.style.display = 'block';
            sidebarOverlay.style.display = 'none'; // Hide overlay on smaller screens
        } else {
            sidebar.classList.remove('hidden');
            sidebar.classList.remove('open');
            homeBtn.style.display = 'none';
            menuBtn.style.display = 'none';
            closeSidebarBtn.style.display = 'none';
            sidebarOverlay.style.display = 'none'; // Hide overlay on larger screens
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check
});

document.addEventListener("DOMContentLoaded", function () {
    const supportDiv = document.querySelector('.support_div');
    const notepadDiv = document.querySelector('.notepad_div');
    const notificationIcon = document.getElementById('notificationIcon');
    const supportDropdown = document.getElementById('supportDropdown');
    const notepadDropdown = document.getElementById('notepadDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const createNoteBtn = document.getElementById('createNoteBtn');
    const viewAllNotesBtn = document.getElementById('viewAllNotesBtn');
    const createNoteSection = document.getElementById('createNoteSection');
    const allNotesSection = document.getElementById('allNotesSection');
    const savedNotes = document.getElementById('savedNotes');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Function to hide all dropdowns
    function hideAllDropdowns() {
        supportDropdown.style.display = 'none';
        notepadDropdown.style.display = 'none';
        notificationDropdown.style.display = 'none';
    }

    function renderNotes() {
        savedNotes.innerHTML = '';
        notes.forEach((note, index) => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.innerHTML = `
                <h4>${note.title}</h4>
                <p>${note.content.slice(0, 50)}...</p>
                <button onclick="viewNote(${index})">View</button>
                <button onclick="deleteNote(${index})">Delete</button>
            `;
            savedNotes.appendChild(noteCard);
        });
    }

    function saveNoteToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    window.viewNote = function(index) {
        const note = notes[index];
        createNoteSection.style.display = 'block';
        allNotesSection.style.display = 'none';
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
    };

    window.deleteNote = function(index) {
        notes.splice(index, 1);
        saveNoteToLocalStorage();
        renderNotes();
    };

    // Event Listeners
    supportDiv.addEventListener('click', () => {
        hideAllDropdowns();
        supportDropdown.style.display = 'block';
    });

    notepadDiv.addEventListener('click', () => {
        hideAllDropdowns();
        notepadDropdown.style.display = 'block';
    });

    notificationIcon.addEventListener('click', () => {
        hideAllDropdowns();
        notificationDropdown.style.display = 'block';
    });

    createNoteBtn.addEventListener('click', () => {
        createNoteSection.style.display = 'block';
        allNotesSection.style.display = 'none';
    });

    viewAllNotesBtn.addEventListener('click', () => {
        createNoteSection.style.display = 'none';
        allNotesSection.style.display = 'block';
        renderNotes();
    });

    document.getElementById('createNoteForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        notes.push({ title, content });
        saveNoteToLocalStorage();
        renderNotes();
        this.reset();
    });

    // Initial render of saved notes
    renderNotes();
});
document.addEventListener("DOMContentLoaded", function () {
    // Dropdown elements
    const supportDiv = document.querySelector('.support_div');
    const notepadDiv = document.querySelector('.notepad_div');
    const notificationIcon = document.getElementById('notificationIcon');

    // Close buttons
    const closeSupport = document.getElementById('closeSupport');
    const closeNotepad = document.getElementById('closeNotepad');
    const closeNotifications = document.getElementById('closeNotifications');

    // Dropdown containers
    const supportDropdown = document.getElementById('supportDropdown');
    const notepadDropdown = document.getElementById('notepadDropdown');
    const notificationDropdown = document.getElementById('notificationDropdown');

    // Error handling: Check if elements exist before proceeding
    if (!supportDiv || !notepadDiv || !notificationIcon || 
        !closeSupport || !closeNotepad || !closeNotifications || 
        !supportDropdown || !notepadDropdown || !notificationDropdown) {
        console.error("One or more elements are missing. Please ensure all elements are present in the HTML.");
        return;
    }

    // Function to hide all dropdowns
    function hideAllDropdowns() {
        supportDropdown.classList.remove('show');
        notepadDropdown.classList.remove('show');
        notificationDropdown.classList.remove('show');
    }

    // Function to toggle the visibility of a given dropdown
    function toggleDropdown(dropdown) {
        // Hide all dropdowns first
        hideAllDropdowns();
        // Toggle the visibility of the clicked dropdown
        dropdown.classList.toggle('show');
    }

    // Event listeners for opening/closing dropdowns
    supportDiv.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click propagation
        toggleDropdown(supportDropdown);
    });

    notepadDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown(notepadDropdown);
    });

    notificationIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown(notificationDropdown);
    });

    // Event listeners for close buttons
    closeSupport.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering the parent click event
        supportDropdown.classList.remove('show');
    });

    closeNotepad.addEventListener('click', (event) => {
        event.stopPropagation();
        notepadDropdown.classList.remove('show');
    });

    closeNotifications.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationDropdown.classList.remove('show');
    });

    // Clicking outside a dropdown closes all dropdowns
    document.addEventListener('click', () => {
        hideAllDropdowns();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.getElementById("searchIcon");
    const searchBar = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");

    // Error handling: Check if elements exist before proceeding
    if (!searchIcon || !searchBar || !searchInput) {
        console.error("Search elements are missing. Please ensure all elements are present in the HTML.");
        return;
    }

    // Toggle search bar visibility on search icon click
    searchIcon.addEventListener("click", function () {
        searchBar.classList.toggle("show");
        searchInput.focus();
    });

    // Hide search bar if clicked outside
    document.addEventListener("click", function (event) {
        if (!searchBar.contains(event.target) && !searchIcon.contains(event.target)) {
            searchBar.classList.remove("show");
        }
    });

    // Prevent event propagation when clicking inside the search bar
    searchBar.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const chatBotIcon = document.getElementById('chatBotIcon');
    const chatbotDropdown = document.getElementById('chatbotDropdown');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatHistory = document.getElementById('chatHistory');
    const chatBotLink = document.getElementById('chatBotLink');

    // Toggle chatbot dropdown
    chatBotIcon.addEventListener('click', function (event) {
        event.stopPropagation();
        chatbotDropdown.classList.toggle('show');
    });

    // Open chatbot from support link
    chatBotLink.addEventListener('click', function (event) {
        event.preventDefault();
        chatbotDropdown.classList.toggle('show'); // Open/close chatbot
    });

    // Close chatbot
    closeChatbot.addEventListener('click', function (event) {
        event.stopPropagation();
        chatbotDropdown.classList.remove('show');
    });

    // Function to send a message
    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return; // Do not send empty messages

        // Display user message
        const userMessageElem = document.createElement('div');
        userMessageElem.classList.add('user-message');
        userMessageElem.textContent = userMessage;
        chatHistory.appendChild(userMessageElem);

        // Clear input field
        chatInput.value = '';

        // Simulate bot response after a short delay
        setTimeout(() => {
            const botMessageElem = document.createElement('div');
            botMessageElem.classList.add('bot-message');
            botMessageElem.textContent = getBotResponse(userMessage);
            chatHistory.appendChild(botMessageElem);

            // Scroll to the bottom of chat history
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 500);
    }

    // Function to get a bot response (simple logic for demonstration)
    function getBotResponse(message) {
        const responses = {
            "hello": "Hi there! How can I assist you today?",
            "agriculture": "Agriculture involves the cultivation of plants and livestock.",
            "crypto": "Cryptocurrency is a digital or virtual currency that uses cryptography for security.",
            "technology": "Technology refers to the application of scientific knowledge for practical purposes."
        };
        return responses[message.toLowerCase()] || "I'm sorry, I don't have an answer for that.";
    }

    // Event listener for sending messages
    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Hide chatbot when clicking outside
    document.addEventListener('click', () => {
        chatbotDropdown.classList.remove('show');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Chatbot Variables
    const chatBotLink = document.getElementById('chatBotLink');
    const chatbotDropdown = document.getElementById('chatbotDropdown');
    const closeChatbotBtn = document.getElementById('closeChatbot');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatHistory = document.getElementById('chatHistory');

    // Hide chatbot on load
    chatbotDropdown.style.display = 'none';

    // Function to show the chatbot
    function showChatbot() {
        console.log("Showing chatbot");
        chatbotDropdown.style.display = 'block';
    }

    // Function to hide the chatbot
    function hideChatbot() {
        console.log("Hiding chatbot");
        chatbotDropdown.style.display = 'none';
    }

    // Show chatbot when the Chat Bot link (or icon) is clicked
    chatBotLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default anchor link behavior
        console.log("Chat Bot link clicked");
        showChatbot();
    });

    // Hide chatbot when the close button is clicked
    closeChatbotBtn.addEventListener('click', function() {
        console.log("Close button clicked");
        hideChatbot();
    });

    // Send message function
    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return; // Do not send empty messages

        // Create user message element
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('user-message');
        userMessageElement.textContent = userMessage;
        chatHistory.appendChild(userMessageElement);

        // Clear the input field
        chatInput.value = '';

        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Display a response from Kotana (basic simulation)
        setTimeout(() => {
            const botResponseElement = document.createElement('div');
            botResponseElement.classList.add('bot-response');
            botResponseElement.textContent = "Kotana: I'm here to assist you!";
            chatHistory.appendChild(botResponseElement);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 1000); // Simulate a delay for the bot response
    }

    // Event listener for sending a message
    sendChatBtn.addEventListener('click', sendMessage);

    // Send message when the Enter key is pressed in the input field
    chatInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});

// === Add Post Functionality ===
    addPostBtn.addEventListener('click', () => {
        togglePopup(postPopup);
        closeAllPopupsExcept(postPopup);
    });

    submitPost.addEventListener('click', (e) => {
        e.preventDefault();
        const content = postText.value.trim();
        if (content === '') {
            alert('Please enter some content for your post.');
            return;
        }
        createPost(content);
        postText.value = '';
        togglePopup(postPopup);
    });

    cancelPost.addEventListener('click', () => {
        togglePopup(postPopup);
    });

    attachmentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        attachmentOptions.classList.toggle('active');
    });

    // Close attachment options when clicking outside
    document.addEventListener('click', (e) => {
        if (!attachmentOptions.contains(e.target) && e.target !== attachmentBtn) {
            attachmentOptions.classList.remove('active');
        }
    });

    function createPost(content) {
        const postFeed = document.getElementById('postFeed');
        const newPost = document.createElement('div');
        newPost.classList.add('post', 'general'); // Default category

        newPost.innerHTML = `
            <div class="post-user">
                <img src="Assets/user_default.jpg" alt="You">
                <p>@You</p>
            </div>
            <div class="post-content">
                <p>${escapeHTML(content)}</p>
                <div class="post-reactions">
                    <button class="like-btn">Like</button>
                    <button class="comment-btn">Comment</button>
                    <button class="share-btn">Share</button>
                </div>
            </div>
        `;
        postFeed.prepend(newPost);
    }

// === Go Live Functionality ===
goLiveBtn.addEventListener('click', () => {
    togglePopup(goLivePopup);
    closeAllPopupsExcept(goLivePopup);
});

audioLiveBtn.addEventListener('click', () => {
    goLiveOptions.classList.add('active');
});

videoLiveBtn.addEventListener('click', () => {
    goLiveOptions.classList.add('active');
});

proceedLive.addEventListener('click', () => {
    alert('Live session started!');
    togglePopup(goLivePopup);
    goLiveOptions.classList.remove('active');
});

cancelLive.addEventListener('click', () => {
    togglePopup(goLivePopup);
    goLiveOptions.classList.remove('active');
});
// === Live Now Functionality ===
seeMoreLive.addEventListener('click', () => {
    liveNow.classList.add('expanded');
});

closeSeeMore.addEventListener('click', () => {
    liveNow.classList.remove('expanded');
});


// === Notifications Functionality ===
// Notification Elements
const notificationIcon = document.getElementById('notificationIcon');
const notificationDropdown = document.getElementById('notificationDropdown');
const filterButtons = notificationDropdown.querySelectorAll('.order-filter');
const notificationsGroups = notificationDropdown.querySelectorAll('.notifications-group');
notificationIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-type');
        activateNotificationFilter(button, type);
    });
});

function activateNotificationFilter(button, type) {
    // Remove active class from all filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    button.classList.add('active');

    // Hide all notification groups
    notificationsGroups.forEach(group => {
        group.classList.remove('active');
    });

    // Show the selected notification group
    const selectedGroup = document.querySelector(`.notifications-group[data-type="${type}"]`);
    if (selectedGroup) {
        selectedGroup.classList.add('active');
    }
}

// Close notifications when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationIcon) {
        notificationDropdown.classList.remove('active');
    }
});
// === Notifications Click Outside ===
document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationIcon) {
        notificationDropdown.classList.remove('active');
    }
});

// === Status Updates Functionality ===
    // Status Updates Swipe Functionality
    let statusStartX;
    let statusScrollLeft;

    statusUpdatesSessions.addEventListener('mousedown', (e) => {
        statusStartX = e.pageX - statusUpdatesSessions.offsetLeft;
        statusScrollLeft = statusUpdatesSessions.scrollLeft;
        statusUpdatesSessions.classList.add('active');
    });

    statusUpdatesSessions.addEventListener('mouseleave', () => {
        statusUpdatesSessions.classList.remove('active');
    });

    statusUpdatesSessions.addEventListener('mouseup', () => {
        statusUpdatesSessions.classList.remove('active');
    });

    statusUpdatesSessions.addEventListener('mousemove', (e) => {
        if (!statusUpdatesSessions.classList.contains('active')) return;
        e.preventDefault();
        const x = e.pageX - statusUpdatesSessions.offsetLeft;
        const walk = (x - statusStartX) * 2; //scroll-fast
        statusUpdatesSessions.scrollLeft = statusScrollLeft - walk;
        updateStatusDots();
    });

    // Touch events for mobile
    statusUpdatesSessions.addEventListener('touchstart', (e) => {
        statusStartX = e.touches[0].pageX - statusUpdatesSessions.offsetLeft;
        statusScrollLeft = statusUpdatesSessions.scrollLeft;
    });

    statusUpdatesSessions.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - statusUpdatesSessions.offsetLeft;
        const walk = (x - statusStartX) * 2; //scroll-fast
        statusUpdatesSessions.scrollLeft = statusScrollLeft - walk;
        updateStatusDots();
    });

    function updateStatusDots() {
        const scrollLeft = statusUpdatesSessions.scrollLeft;
        const width = statusUpdatesSessions.scrollWidth - statusUpdatesSessions.clientWidth;
        const scrollPercentage = (scrollLeft / width) * 100;
        const dotIndex = Math.floor((scrollPercentage / 100) * statusDots.children.length);

        statusDots.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }
// === Live Now Swipe Functionality ===
let liveStartX;
let liveScrollLeft;

liveSessions.addEventListener('mousedown', (e) => {
    liveStartX = e.pageX - liveSessions.offsetLeft;
    liveScrollLeft = liveSessions.scrollLeft;
    liveSessions.classList.add('active');
});

liveSessions.addEventListener('mouseleave', () => {
    liveSessions.classList.remove('active');
});

liveSessions.addEventListener('mouseup', () => {
    liveSessions.classList.remove('active');
});

liveSessions.addEventListener('mousemove', (e) => {
    if (!liveSessions.classList.contains('active')) return;
    e.preventDefault();
    const x = e.pageX - liveSessions.offsetLeft;
    const walk = (x - liveStartX) * 2; //scroll-fast
    liveSessions.scrollLeft = liveScrollLeft - walk;
    updateLiveDots();
});

// Touch events for mobile
liveSessions.addEventListener('touchstart', (e) => {
    liveStartX = e.touches[0].pageX - liveSessions.offsetLeft;
    liveScrollLeft = liveSessions.scrollLeft;
});

liveSessions.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - liveSessions.offsetLeft;
    const walk = (x - liveStartX) * 2; //scroll-fast
    liveSessions.scrollLeft = liveScrollLeft - walk;
    updateLiveDots();
});

function updateLiveDots() {
    const scrollLeft = liveSessions.scrollLeft;
    const width = liveSessions.scrollWidth - liveSessions.clientWidth;
    const scrollPercentage = (scrollLeft / width) * 100;
    const dotIndex = Math.floor((scrollPercentage / 100) * liveDots.children.length);

    liveDots.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === dotIndex);
    });
}
// === Notifications Click Outside ===
document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationIcon) {
        notificationDropdown.classList.remove('active');
    }
});

// === Helper Functions ===
function togglePopup(popup) {
    popup.classList.toggle('active');
}

function closeAllPopupsExcept(popupToKeep) {
    const popups = document.querySelectorAll('.popup, .go-live-popup');
    popups.forEach(popup => {
        if (popup !== popupToKeep) {
            popup.classList.remove('active');
        }
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Function to toggle the submenu's visibility when a nav-link is clicked
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);        // Get the submenu by ID
    const parentLink = submenu.parentElement;                  // Get the parent nav-link element

    // Close all other submenus
    document.querySelectorAll('.submenu').forEach(menu => {
        if (menu !== submenu) {
            menu.style.display = 'none'; // Hide other submenus
            menu.parentElement.classList.remove('active'); // Remove 'active' class from their parent
        }
    });

    // Toggle the current submenu visibility
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none'; // Close if already open
        parentLink.classList.remove('active'); // Remove 'active' class from parent
    } else {
        submenu.style.display = 'block'; // Open the submenu
        parentLink.classList.add('active'); // Add 'active' class to parent
    }
}

// Add click event listeners for submenu links to set the active class
document.querySelectorAll('.submenu a').forEach(link => {
    link.addEventListener('click', function (e) {
        // Remove 'active' class from all sublinks
        document.querySelectorAll('.submenu a').forEach(sublink => sublink.classList.remove('active'));

        // Add 'active' class to the clicked sublink
        this.classList.add('active');
        
        // Stop the event from propagating up to the parent link to avoid closing the menu
        e.stopPropagation();
    });
});

// Close all submenus when clicking outside the sidebar (optional feature)
document.addEventListener('click', function (e) {
    const sidebar = document.querySelector('.nav-links');
    if (!sidebar.contains(e.target)) {
        // Hide all submenus when clicking outside the sidebar
        document.querySelectorAll('.submenu').forEach(menu => {
            menu.style.display = 'none';
            menu.parentElement.classList.remove('active');
        });
    }
});
