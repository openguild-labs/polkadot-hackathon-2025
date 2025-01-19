// Simulate responses for prototyping
async function queryOpenAI(userMessage) {
    // Simulating a response as if from an AI trained in agriculture
    const responses = {
        "What are the best crops to plant in spring?": "The best crops for spring include lettuce, peas, spinach, and radishes. They thrive in moderate temperatures and mild weather.",
        "How do I prevent pests in my crops?": "You can prevent pests by using organic pest control methods, such as neem oil, introducing beneficial insects like ladybugs, and practicing crop rotation.",
        "What is the current weather like?": "Simulated weather: It's sunny with mild temperatures, ideal for planting crops like beans and tomatoes.",
        "How is my soil health?": "The soil is rich in nutrients, but it's important to monitor moisture levels to prevent drought stress. Consider adding organic compost for better structure."
    };

    // Return a simulated response if it matches any predefined queries
    const response = responses[userMessage] || "I'm not sure about that. Let me provide general advice on agriculture.";

    return response;
}

// Simulate weather data response
async function fetchWeatherData(location) {
    // Hardcoded data for the purpose of prototyping
    const weatherData = {
        location: location,
        temperature: 25, // Example temperature in Celsius
        condition: "Sunny",
        advice: "Great weather for planting crops like tomatoes and peppers."
    };

    return `The current temperature in ${location} is ${weatherData.temperature}°C with ${weatherData.condition}. ${weatherData.advice}`;
}

// Simulate crop advice response
async function fetchCropAdvice(location) {
    // Hardcoded data for crop advice
    const cropAdvice = {
        location: location,
        recommendedCrops: "Rice, Barley, and Wheat",
        soilCondition: "The soil has good moisture content, suitable for these crops."
    };

    return `For your location, consider planting crops such as ${cropAdvice.recommendedCrops}. ${cropAdvice.soilCondition}`;
}

// Handle chat message and integrate AI and agricultural data
async function handleChatMessage(message, location) {
    let response;

    if (message.toLowerCase().includes('weather')) {
        response = await fetchWeatherData(location);
    } else if (message.toLowerCase().includes('crop advice')) {
        response = await fetchCropAdvice(location);
    } else {
        response = await queryOpenAI(message);
    }

    displayResponse(response);  // Function to display the response in the chat window
}

// Function to display the AI response in the chat window
function displayResponse(response) {
    const chatWindow = document.querySelector('.chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'receiver');
    messageDiv.textContent = response;
    chatWindow.querySelector('.messages').appendChild(messageDiv);
    chatWindow.querySelector('.messages').scrollTop = chatWindow.querySelector('.messages').scrollHeight;
}

// Send the user's message and get a response from the AI
const userMessageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
sendButton.addEventListener('click', () => {
    const userMessage = userMessageInput.value.trim();
    if (userMessage) {
        // Display user's message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'sender');
        userMessageDiv.textContent = userMessage;
        document.querySelector('.chat-window .messages').appendChild(userMessageDiv);

        // Get AI response
        handleChatMessage(userMessage, 'Simulated Location');  // Use a placeholder location for prototyping

        userMessageInput.value = ''; // Clear the input field
    }
});
