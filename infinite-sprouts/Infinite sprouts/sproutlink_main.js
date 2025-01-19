document.addEventListener('DOMContentLoaded', () => {
    // === Element Selectors ===

    // Sidebar Elements
    const themeSwitcher = document.getElementById('theme-switcher');
    const addPostBtn = document.getElementById('addPostBtn');
    const goLiveBtn = document.getElementById('goLiveBtn');

    // Popups
    const postPopup = document.getElementById('postPopup');
    const submitPost = document.getElementById('submitPost');
    const cancelPost = document.getElementById('cancelPost');
    const attachmentBtn = document.getElementById('attachmentBtn');
    const attachmentOptions = document.getElementById('attachmentOptions');
    const postText = document.getElementById('postText');

    const goLivePopup = document.getElementById('goLivePopup');
    const audioLiveBtn = document.getElementById('audioLiveBtn');
    const videoLiveBtn = document.getElementById('videoLiveBtn');
    const goLiveOptions = document.getElementById('goLiveOptions');
    const proceedLive = document.getElementById('proceedLive');
    const cancelLive = document.getElementById('cancelLive');

    // Create Community Popup
    const createCommunityBtn = document.getElementById('createCommunityBtn');
    const createCommunityPopup = document.getElementById('createCommunityPopup');
    const submitCommunity = document.getElementById('submitCommunity');
    const cancelCommunity = document.getElementById('cancelCommunity');
    const communityName = document.getElementById('communityName');
    const communityDescription = document.getElementById('communityDescription');

    // Sub Heading Navigation
    const feedsBtn = document.getElementById('feedsBtn');
    const messagesBtn = document.getElementById('messagesBtn');
    const communitiesBtn = document.getElementById('communitiesBtn');

    const feedsSection = document.getElementById('feedsSection');
    const messagesSection = document.getElementById('messagesSection');
    const communitiesSection = document.getElementById('communitiesSection');

    // Feed Filters
    const allPostsBtn = document.getElementById('allPostsBtn');
    const agriculturePostsBtn = document.getElementById('agriculturePostsBtn');
    const cryptoPostsBtn = document.getElementById('cryptoPostsBtn');
    const politicsPostsBtn = document.getElementById('politicsPostsBtn');

    // Notification Elements
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const filterButtons = notificationDropdown.querySelectorAll('.order-filter');
    const notificationsGroups = notificationDropdown.querySelectorAll('.notifications-group');

    // Communities Tabs
    const myCommunitiesBtn = document.getElementById('myCommunitiesBtn');
    const joinedCommunitiesBtn = document.getElementById('joinedCommunitiesBtn');
    const myCommunitiesList = document.getElementById('myCommunitiesList');
    const joinedCommunitiesList = document.getElementById('joinedCommunitiesList');

    // Community Sub-tabs
    const createdCommunitiesTab = document.getElementById('createdCommunitiesTab');
    const manageCommunitiesTab = document.getElementById('manageCommunitiesTab');
    const createdCommunities = document.getElementById('createdCommunities');
    const manageCommunities = document.getElementById('manageCommunities');

    // Live Now Elements
    const liveNow = document.getElementById('liveNow');
    const liveSessions = document.getElementById('liveSessions');
    const seeMoreLive = document.getElementById('seeMoreLive');
    const closeSeeMore = document.getElementById('closeSeeMore');
    const liveDots = document.getElementById('liveDots');

    // Status Updates Elements
    const statusUpdates = document.getElementById('statusUpdates');
    const statusUpdatesSessions = document.getElementById('statusUpdatesSessions');
    const statusDots = document.getElementById('statusDots');

    // Chat Elements
    const friendsList = document.getElementById('friendsList');
    const chatWindow = document.getElementById('chatWindow');
    const backBtn = document.getElementById('backBtn');
    const chatWith = document.getElementById('chatWith');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const chatAttachmentBtn = document.getElementById('chatAttachmentBtn');
    const chatAttachmentOptions = document.getElementById('chatAttachmentOptions');
    const messageCounter = document.getElementById('messageCounter');
    const MAX_MESSAGES = 50; // Set your desired limit

    // Community Feed Elements (Dynamic)
    let currentCommunity = null; // To track the active community

    // === Theme Switching ===
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updateThemeSwitcher();
    });

    function updateThemeSwitcher() {
        const icon = themeSwitcher.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i> Light';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i> Dark';
        }
    }

    // === Section Navigation ===
    // Initialize with Feeds section active
    setActiveSection('feeds');

    feedsBtn.addEventListener('click', () => {
        setActiveSection('feeds');
    });

    messagesBtn.addEventListener('click', () => {
        setActiveSection('messages');
    });

    communitiesBtn.addEventListener('click', () => {
        setActiveSection('communities');
    });

    function setActiveSection(section) {
        // Remove active class from all buttons
        feedsBtn.classList.remove('active');
        messagesBtn.classList.remove('active');
        communitiesBtn.classList.remove('active');

        // Hide all sections
        feedsSection.style.display = 'none';
        messagesSection.style.display = 'none';
        communitiesSection.style.display = 'none';

        // Show the selected section and add active class to button
        if (section === 'feeds') {
            feedsSection.style.display = 'flex';
            feedsSection.classList.add('active');
            feedsBtn.classList.add('active');
        } else if (section === 'messages') {
            messagesSection.style.display = 'flex';
            messagesSection.classList.add('active');
            messagesBtn.classList.add('active');
        } else if (section === 'communities') {
            communitiesSection.style.display = 'flex';
            communitiesSection.classList.add('active');
            communitiesBtn.classList.add('active');
        }
    }

    // === Feed Filtering ===
    allPostsBtn.addEventListener('click', () => {
        filterPosts('all');
    });

    agriculturePostsBtn.addEventListener('click', () => {
        filterPosts('agriculture');
    });

    cryptoPostsBtn.addEventListener('click', () => {
        filterPosts('crypto');
    });

    politicsPostsBtn.addEventListener('click', () => {
        filterPosts('politics');
    });

    function filterPosts(category) {
        // Remove active class from all buttons
        allPostsBtn.classList.remove('active');
        agriculturePostsBtn.classList.remove('active');
        cryptoPostsBtn.classList.remove('active');
        politicsPostsBtn.classList.remove('active');

        // Add active class to the selected button
        if (category === 'all') {
            allPostsBtn.classList.add('active');
        } else if (category === 'agriculture') {
            agriculturePostsBtn.classList.add('active');
        } else if (category === 'crypto') {
            cryptoPostsBtn.classList.add('active');
        } else if (category === 'politics') {
            politicsPostsBtn.classList.add('active');
        }

        // Show/hide posts based on category
        const posts = document.querySelectorAll('#postFeed .post');
        posts.forEach(post => {
            if (category === 'all') {
                post.style.display = 'flex';
            } else {
                if (post.classList.contains(category)) {
                    post.style.display = 'flex';
                } else {
                    post.style.display = 'none';
                }
            }
        });
    }
    // === Create Community Functionality ===
    createCommunityBtn.addEventListener('click', () => {
        togglePopup(createCommunityPopup);
        closeAllPopupsExcept(createCommunityPopup);
    });

    submitCommunity.addEventListener('click', () => {
        const name = communityName.value.trim();
        const description = communityDescription.value.trim();
        if (name === '' || description === '') {
            alert('Please enter both community name and description.');
            return;
        }
        createCommunity(name, description);
        communityName.value = '';
        communityDescription.value = '';
        togglePopup(createCommunityPopup);
    });

    cancelCommunity.addEventListener('click', () => {
        togglePopup(createCommunityPopup);
    });

    function createCommunity(name, description) {
        const communityItem = document.createElement('div');
        communityItem.classList.add('community-item');

        communityItem.innerHTML = `
            <div class="community-info">
                <h4>${escapeHTML(name)}</h4>
                <p>${escapeHTML(description)}</p>
            </div>
            <div class="community-actions">
                <button class="go-to-community-btn">Go</button>
                <button class="delete-community-btn">Delete</button>
            </div>
        `;
        // Insert before the Create Community button
        myCommunitiesList.insertBefore(communityItem, createCommunityBtn);
    }

    // === Notifications Functionality ===
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

    // === Communities Functionality ===
    myCommunitiesBtn.addEventListener('click', () => {
        setActiveCommunityTab('my');
    });

    joinedCommunitiesBtn.addEventListener('click', () => {
        setActiveCommunityTab('joined');
    });

    function setActiveCommunityTab(tab) {
        // Remove active class from all buttons
        myCommunitiesBtn.classList.remove('active');
        joinedCommunitiesBtn.classList.remove('active');

        // Hide all community lists
        myCommunitiesList.classList.remove('active');
        joinedCommunitiesList.classList.remove('active');

        // Show the selected community list and add active class to button
        if (tab === 'my') {
            myCommunitiesList.classList.add('active');
            myCommunitiesBtn.classList.add('active');
        } else if (tab === 'joined') {
            joinedCommunitiesList.classList.add('active');
            joinedCommunitiesBtn.classList.add('active');
        }
    }

    // === Community Sub-tabs Functionality ===
    const myCommunitySubtabs = myCommunitiesList.querySelectorAll('.my-community-subtab');
    const createdCommunitiesDiv = document.getElementById('createdCommunities');
    const manageCommunitiesDiv = document.getElementById('manageCommunities');

    myCommunitySubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all sub-tabs
            myCommunitySubtabs.forEach(t => t.classList.remove('active'));

            // Add active class to the clicked sub-tab
            tab.classList.add('active');

            // Show/hide community lists based on sub-tab
            if (tab.id === 'createdCommunitiesTab') {
                createdCommunitiesDiv.classList.add('active');
                manageCommunitiesDiv.classList.remove('active');
            } else if (tab.id === 'manageCommunitiesTab') {
                createdCommunitiesDiv.classList.remove('active');
                manageCommunitiesDiv.classList.add('active');
            }
        });
    });

    // === Handle Dynamic Buttons in Communities ===
    communitiesSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('go-to-community-btn')) {
            const communityItem = e.target.closest('.community-item');
            const communityName = communityItem.querySelector('.community-info h4').textContent;
            enterCommunity(communityName);
        }

        if (e.target.classList.contains('delete-community-btn')) {
            if (confirm('Are you sure you want to delete this community?')) {
                const communityItem = e.target.closest('.community-item');
                communityItem.remove();
            }
        }

        if (e.target.classList.contains('leave-community-btn')) {
            if (confirm('Are you sure you want to leave this community?')) {
                const communityItem = e.target.closest('.community-item');
                communityItem.remove();
            }
        }

        if (e.target.classList.contains('manage-community-btn')) {
            // Implement manage community functionality
            alert('Manage Community clicked!');
        }
    });

    function enterCommunity(name) {
        currentCommunity = name;
        // Hide main sections and show community feed
        setActiveSection(null); // Hide all main sections

        // Create or navigate to community feed
        openCommunityFeed(name);
    }

    function openCommunityFeed(name) {
        // Check if a community feed already exists
        let communityFeed = document.getElementById('communityFeed');
        if (!communityFeed) {
            communityFeed = document.createElement('div');
            communityFeed.id = 'communityFeed';
            communityFeed.classList.add('community-feed');
            communityFeed.innerHTML = `
                <h2>${escapeHTML(name)} - Feed</h2>
                <div class="community-post-form">
                    <textarea id="communityPostText" placeholder="What's on your mind?"></textarea>
                    <button id="communitySubmitPost">Post</button>
                </div>
                <div class="community-posts" id="communityPosts">
                    <!-- Community posts will appear here -->
                </div>
            `;
            communitiesSection.appendChild(communityFeed);
        } else {
            communityFeed.innerHTML = `
                <h2>${escapeHTML(name)} - Feed</h2>
                <div class="community-post-form">
                    <textarea id="communityPostText" placeholder="What's on your mind?"></textarea>
                    <button id="communitySubmitPost">Post</button>
                </div>
                <div class="community-posts" id="communityPosts">
                    <!-- Community posts will appear here -->
                </div>
            `;
        }

        // Hide other sections
        feedsSection.style.display = 'none';
        messagesSection.style.display = 'none';
        communitiesSection.style.display = 'none';
        communityFeed.style.display = 'flex';

        // Handle community post submission
        const communitySubmitPost = document.getElementById('communitySubmitPost');
        const communityPostText = document.getElementById('communityPostText');
        const communityPosts = document.getElementById('communityPosts');

        communitySubmitPost.addEventListener('click', () => {
            const content = communityPostText.value.trim();
            if (content === '') {
                alert('Please enter some content for your post.');
                return;
            }
            createCommunityPost(content);
            communityPostText.value = '';
        });

        function createCommunityPost(content) {
            const newPost = document.createElement('div');
            newPost.classList.add('community-post');
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
            communityPosts.prepend(newPost);
        }
    }

    // === Notifications Click Outside ===
    document.addEventListener('click', (e) => {
        if (!notificationDropdown.contains(e.target) && e.target !== notificationIcon) {
            notificationDropdown.classList.remove('active');
        }
    });

    // === Live Now Functionality ===
    seeMoreLive.addEventListener('click', () => {
        liveNow.classList.add('expanded');
    });

    closeSeeMore.addEventListener('click', () => {
        liveNow.classList.remove('expanded');
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

    // === Messaging Functionality ===
    let currentChatUser = 'AI'; // Default chat user
    const aiChatFriend = friendsList.querySelector('.friend-item[data-user="AI"]');

    // Ensure AI chat friend is on top
    friendsList.insertBefore(aiChatFriend, friendsList.firstChild);

    // Select AI chat friend by default
    aiChatFriend.classList.add('active');
    chatWith.textContent = `Chat with @AI`;
    chatWindow.style.display = 'none'; // Hide chat window by default
    backBtn.style.display = 'none';
    messageCounter.textContent = '0';
    messageCounter.classList.remove('active');

    // Handle Friend Selection
    friendsList.addEventListener('click', (e) => {
        const friendItem = e.target.closest('.friend-item');
        if (friendItem) {
            // Remove active class from all friends
            friendsList.querySelectorAll('.friend-item').forEach(item => item.classList.remove('active'));

            // Add active class to selected friend
            friendItem.classList.add('active');

            // Get user data
            const user = friendItem.getAttribute('data-user');

            // Update chat header
            chatWith.textContent = `Chat with @${user}`;

            // Show back button if not AI
            if (user !== 'AI') {
                backBtn.style.display = 'flex';
            } else {
                backBtn.style.display = 'none';
            }

            // Show chat window
            chatWindow.style.display = 'flex';

            // Reset message counter
            messageCounter.textContent = '0';
            messageCounter.classList.remove('active');

            // Update currentChatUser
            currentChatUser = user;

            // Load chat messages for the selected user
            loadChatMessages(user);
        }
    });

    // === Back Button Functionality ===
    backBtn.addEventListener('click', () => {
        // Remove active class from all friends
        friendsList.querySelectorAll('.friend-item').forEach(item => item.classList.remove('active'));

        // Select AI chat friend
        aiChatFriend.classList.add('active');
        chatWith.textContent = `Chat with @AI`;
        backBtn.style.display = 'none';
        currentChatUser = 'AI';

        // Show chat window
        chatWindow.style.display = 'flex';

        // Reset message counter
        messageCounter.textContent = '0';
        messageCounter.classList.remove('active');

        // Clear chat messages and set to default AI messages
        chatMessages.innerHTML = `
            <p class="other"><strong>AI Assistant:</strong> Hello! How can I assist you today?</p>
            <p class="you"><strong>You:</strong> I need help with managing my communities.</p>
        `;
    });

    // === Chat Attachment Functionality ===
    chatAttachmentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatAttachmentOptions.classList.toggle('active');
    });

    // Close chat attachment options when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatAttachmentOptions.contains(e.target) && e.target !== chatAttachmentBtn) {
            chatAttachmentOptions.classList.remove('active');
        }
    });

    // === Chat Functionality ===
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message === '') return;
        appendMessage('you', message);
        chatInput.value = '';
        incrementMessageCounter();

        // Simulate a response from AI
        if (currentChatUser === 'AI') {
            setTimeout(() => {
                appendMessage('other', 'I am here to help you!');
                incrementMessageCounter();
            }, 1000);
        }
    });

    function appendMessage(sender, message) {
        const msg = document.createElement('p');
        msg.classList.add(sender === 'you' ? 'you' : 'other');
        msg.innerHTML = `<strong>${sender === 'you' ? 'You' : `@${currentChatUser}`}:</strong> ${escapeHTML(message)}`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function incrementMessageCounter() {
        const currentCount = parseInt(messageCounter.textContent) || 0;
        if (currentCount < MAX_MESSAGES) {
            messageCounter.textContent = currentCount + 1;
            if (currentCount + 1 >= MAX_MESSAGES) {
                messageCounter.classList.add('active');
            }
        } else {
            messageCounter.textContent = `${MAX_MESSAGES}+`;
            messageCounter.classList.add('active');
        }
    }

    function loadChatMessages(user) {
        // Placeholder for loading chat messages from backend
        // For now, we'll clear existing messages
        chatMessages.innerHTML = '';
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

    // === Community Feed and Management ===
    function enterCommunity(name) {
        currentCommunity = name;
        // Hide main sections and show community feed
        setActiveSection(null); // Hide all main sections

        // Create or display community feed
        openCommunityFeed(name);
    }

    function openCommunityFeed(name) {
        // Check if a community feed already exists
        let communityFeed = document.getElementById('communityFeed');
        if (!communityFeed) {
            communityFeed = document.createElement('div');
            communityFeed.id = 'communityFeed';
            communityFeed.classList.add('community-feed');
            communityFeed.innerHTML = `
                <h2>${escapeHTML(name)} - Feed</h2>
                <div class="community-post-form">
                    <textarea id="communityPostText" placeholder="What's on your mind?"></textarea>
                    <button id="communitySubmitPost">Post</button>
                </div>
                <div class="community-posts" id="communityPosts">
                    <!-- Community posts will appear here -->
                </div>
            `;
            communitiesSection.appendChild(communityFeed);
        } else {
            communityFeed.innerHTML = `
                <h2>${escapeHTML(name)} - Feed</h2>
                <div class="community-post-form">
                    <textarea id="communityPostText" placeholder="What's on your mind?"></textarea>
                    <button id="communitySubmitPost">Post</button>
                </div>
                <div class="community-posts" id="communityPosts">
                    <!-- Community posts will appear here -->
                </div>
            `;
        }

        // Hide other sections
        feedsSection.style.display = 'none';
        messagesSection.style.display = 'none';
        communitiesSection.style.display = 'none';
        communityFeed.style.display = 'flex';

        // Handle community post submission
        const communitySubmitPost = document.getElementById('communitySubmitPost');
        const communityPostText = document.getElementById('communityPostText');
        const communityPosts = document.getElementById('communityPosts');

        communitySubmitPost.addEventListener('click', () => {
            const content = communityPostText.value.trim();
            if (content === '') {
                alert('Please enter some content for your post.');
                return;
            }
            createCommunityPost(content);
            communityPostText.value = '';
        });

        function createCommunityPost(content) {
            const newPost = document.createElement('div');
            newPost.classList.add('community-post');
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
            communityPosts.prepend(newPost);
        }
    }
});




// Handle channel switching
const channelItems = document.querySelectorAll('.channel-item');
const channelContents = document.querySelectorAll('.channel-content');

channelItems.forEach((item) => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        channelItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');

        // Hide all channel content
        channelContents.forEach((content) => content.classList.add('hidden'));

        // Show the selected channel
        const channelId = item.getAttribute('data-channel');
        document.getElementById(channelId).classList.remove('hidden');
    });
});

// Handle adding a new channel
document.getElementById('addChannelButton').addEventListener('click', () => {
    const newChannelName = prompt("Enter the name of the new channel:");
    if (!newChannelName) return;

    const newChannelId = `channel_${Date.now()}`;
    
    // Add the new channel to the sidebar
    const newChannelItem = document.createElement('li');
    newChannelItem.classList.add('channel-item');
    newChannelItem.setAttribute('data-channel', newChannelId);
    newChannelItem.textContent = newChannelName;
    document.querySelector('.channels-list').appendChild(newChannelItem);

    // Add the new channel content
    const newChannelContent = document.createElement('div');
    newChannelContent.classList.add('channel-content', 'hidden');
    newChannelContent.id = newChannelId;
    newChannelContent.innerHTML = `
        <h3>${newChannelName}</h3>
        <div class="messages"></div>
        <textarea class="input-box" placeholder="Type your message..."></textarea>
    `;
    document.querySelector('.channel-display').appendChild(newChannelContent);

    // Add click functionality to the new channel
    newChannelItem.addEventListener('click', () => {
        channelItems.forEach((i) => i.classList.remove('active'));
        newChannelItem.classList.add('active');

        channelContents.forEach((content) => content.classList.add('hidden'));
        newChannelContent.classList.remove('hidden');
    });
});







document.addEventListener("DOMContentLoaded", function() {
    // Handle switching between channels
    const channelItems = document.querySelectorAll('.channel-item');
    const channelContents = document.querySelectorAll('.channel-content');

    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            const channelId = item.getAttribute('data-channel');
            
            // Hide all channels
            channelContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show the selected channel
            document.getElementById(channelId).classList.remove('hidden');

            // Set active class to the clicked item
            channelItems.forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
        });
    });

    // Handle Add Channel button click
    const addChannelButton = document.getElementById('addChannelButton');
    addChannelButton.addEventListener('click', () => {
        const newChannelName = prompt("Enter new channel name:");
        if (newChannelName) {
            // Create new channel list item
            const newChannelItem = document.createElement('li');
            newChannelItem.classList.add('channel-item');
            newChannelItem.textContent = newChannelName;
            newChannelItem.setAttribute('data-channel', newChannelName);

            // Add new channel to the list
            document.getElementById('channelsList').appendChild(newChannelItem);

            // Create new channel content section
            const newChannelContent = document.createElement('div');
            newChannelContent.classList.add('channel-content', 'hidden');
            newChannelContent.id = newChannelName;

            // Add to channel display area
            const newChannelTitle = document.createElement('h3');
            newChannelTitle.textContent = newChannelName;
            newChannelContent.appendChild(newChannelTitle);

            // Create the message area for the new channel
            const newChannelMessages = document.createElement('div');
            newChannelMessages.classList.add('messages');
            newChannelContent.appendChild(newChannelMessages);

            // Add a textarea for user input in the new channel
            const newTextarea = document.createElement('textarea');
            newTextarea.classList.add('input-box');
            newTextarea.placeholder = `Type your message in ${newChannelName}...`;
            newChannelContent.appendChild(newTextarea);

            // Add the new content to the channel display
            document.querySelector('.channel-display').appendChild(newChannelContent);
        }
    });

    // Initially display the welcome channel
    document.getElementById('welcomeChannel').classList.remove('hidden');
});






document.addEventListener("DOMContentLoaded", function() {
    // Switching between "My Communities" and "Joined Communities"
    const myCommunitiesBtn = document.getElementById('myCommunitiesBtn');
    const joinedCommunitiesBtn = document.getElementById('joinedCommunitiesBtn');
    const myCommunitiesList = document.getElementById('myCommunitiesList');
    const joinedCommunitiesList = document.getElementById('joinedCommunitiesList');

    myCommunitiesBtn.addEventListener('click', function() {
        myCommunitiesBtn.classList.add('active');
        joinedCommunitiesBtn.classList.remove('active');
        myCommunitiesList.classList.add('active');
        joinedCommunitiesList.classList.remove('active');
    });

    joinedCommunitiesBtn.addEventListener('click', function() {
        joinedCommunitiesBtn.classList.add('active');
        myCommunitiesBtn.classList.remove('active');
        joinedCommunitiesList.classList.add('active');
        myCommunitiesList.classList.remove('active');
    });
});




// DOM Elements
const feedsBtn = document.getElementById('feedsBtn');
const communitiesBtn = document.getElementById('communitiesBtn');
const messagesBtn = document.getElementById('messagesBtn');
const sproutsHubBtn = document.getElementById('sproutsHubSection');

// Section Elements
const feedsSection = document.getElementById('feedsSection');
const communitiesSection = document.getElementById('communitiesSection');
const messagesSection = document.getElementById('messagesSection');
const sproutsHubSection = document.getElementById('sproutsHubSectionContent');

// Function to hide all sections
function hideAllSections() {
    feedsSection.style.display = 'none';
    communitiesSection.style.display = 'none';
    messagesSection.style.display = 'none';
    sproutsHubSection.style.display = 'none';
}

// Function to handle section switching
function switchSection(button, section) {
    // Hide all sections first
    hideAllSections();

    // Show the clicked section
    section.style.display = 'block';

    // Remove the active class from all buttons
    const buttons = document.querySelectorAll('.sub_heading_btn');
    buttons.forEach((btn) => {
        btn.classList.remove('active');
    });

    // Add the active class to the clicked button
    button.classList.add('active');
}

// Add event listeners to the buttons
feedsBtn.addEventListener('click', () => {
    switchSection(feedsBtn, feedsSection);
});
communitiesBtn.addEventListener('click', () => {
    switchSection(communitiesBtn, communitiesSection);
});
messagesBtn.addEventListener('click', () => {
    switchSection(messagesBtn, messagesSection);
});
sproutsHubBtn.addEventListener('click', () => {
    switchSection(sproutsHubBtn, sproutsHubSection);
});

// Set default active section (Feeds) and show it on load
window.addEventListener('DOMContentLoaded', () => {
    switchSection(feedsBtn, feedsSection); // Default to Feeds section
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