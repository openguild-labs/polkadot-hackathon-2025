// Function to switch between different sections (e.g., Friend List, Messages, etc.)
function switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('visible');
    });
    document.getElementById(sectionId).classList.add('visible');

    // Update tab styles
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchSection('${sectionId}')"]`).classList.add('active');
}

// Function to simulate AI's response
function generateAIResponse(userMessage) {
    // Basic response logic based on user's input (for simulation purposes)
    const responses = {
        "hello": "Hi there! How can I help you today?",
        "how are you": "I'm just a program, but I'm doing great! How about you?",
        "bye": "Goodbye! Take care!",
        "default": "I'm not sure how to respond to that. Could you ask me something else?"
    };

    // Convert message to lowercase to simplify matching
    const messageLower = userMessage.toLowerCase();

    // Return AI's response or default response if not recognized
    return responses[messageLower] || responses["default"];
}

// Function to open a chat window with the selected friend's name and a message
function openChat(name, message) {
    const chatWindow = document.createElement('div');
    chatWindow.classList.add('chat-window');
    
    // HTML structure for the chat window with a back arrow and messages
    chatWindow.innerHTML = `
        <header>
            <span class="back-arrow" onclick="closeChat()">←</span> <!-- Back Arrow -->
            ${name}
        </header>
        <div class="messages">
            <div class="message receiver">${message}</div> <!-- Initial received message -->
        </div>
        <div class="message-input-container">
            <input type="text" class="message-input" placeholder="Type a message..." />
            <button class="send-button">Send</button>
        </div>
    `;

    // Append the chat window to the active chats container
    document.getElementById('activeChatsContainer').appendChild(chatWindow);

    // Attach the send button action
    const sendButton = chatWindow.querySelector('.send-button');
    const inputField = chatWindow.querySelector('.message-input');

    sendButton.addEventListener('click', () => {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            // Display the user's message in the chat
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'sender'); // Add 'sender' class for user's message
            userMessageDiv.textContent = userMessage;
            chatWindow.querySelector('.messages').appendChild(userMessageDiv);

            // Clear input field after sending message
            inputField.value = '';

            // Generate AI response after the user sends a message
            const aiResponse = generateAIResponse(userMessage);

            // Display the AI's response in the chat
            setTimeout(() => {
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.classList.add('message', 'receiver'); // Add 'receiver' class for AI's message
                aiMessageDiv.textContent = aiResponse;
                chatWindow.querySelector('.messages').appendChild(aiMessageDiv);

                // Scroll the messages to the bottom after new message is added
                chatWindow.querySelector('.messages').scrollTop = chatWindow.querySelector('.messages').scrollHeight;
            }, 1000); // Simulate a delay in the AI's response (1 second)
        }
    });
}

// Function to close the chat window and return to the previous section (friend list)
function closeChat() {
    // Remove the chat window
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        chatWindow.remove();
    }

    // Optionally, bring back the friend list section
    switchSection('dmSection');  // Assuming 'dmSection' is the ID of the friend list section
}
