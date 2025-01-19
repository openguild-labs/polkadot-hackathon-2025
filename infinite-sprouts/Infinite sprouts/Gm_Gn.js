// gm_gn.js

document.addEventListener('DOMContentLoaded', () => {
    const gmGnBtn = document.getElementById('gmGnBtn');

    // Predefined messages for different categories
    const messages = {
        crypto: [
            "GM! 🚀 Ready to dive into today's crypto trends?",
            "GN! 🌙 Secure your crypto assets tonight.",
            "GM! 💹 Bitcoin is on the rise today!",
            "GN! 🛡️ Remember to keep your crypto safe."
        ],
        agriculture: [
            "GM! 🌱 Let's cultivate some success today.",
            "GN! 🌾 Rest well after a fruitful day.",
            "GM! 🚜 Time to innovate in agriculture!",
            "GN! 🌿 Keep nurturing those green dreams."
        ],
        languages: [
            "GM! 🗣️ Ready to learn a new language today?",
            "GN! 📚 Reflect on your language journey tonight.",
            "GM! ✍️ Practice makes perfect in languages.",
            "GN! 💤 Dream in a new language tonight."
        ],
        legends: [
            "GM! 🏰 Embrace the legends of yesterday.",
            "GN! 🌟 Let the legends inspire your dreams.",
            "GM! ⚔️ Create your own legendary stories.",
            "GN! 🛡️ Protect your legendary aspirations."
        ],
        kings: [
            "GM! 👑 Lead your day like a king.",
            "GN! 🌙 Reflect on your royal achievements.",
            "GM! 🏰 Rule your tasks with authority today.",
            "GN! 💤 Rest like a true king tonight."
        ],
        random: [
            "GM! ☀️ A new day awaits your brilliance.",
            "GN! 🌜 May your night be restful and peaceful.",
            "GM! 🌼 Embrace the opportunities today.",
            "GN! ✨ Let the stars guide your dreams tonight."
        ]
    };

    // User preferences (can be extended to fetch from user settings)
    const userPreferences = {
        categories: ['crypto', 'agriculture', 'languages', 'legends', 'kings', 'random']
    };

    gmGnBtn.addEventListener('click', () => {
        const generatedMessage = generateMessage();
        sendMessage(generatedMessage);
    });

    function generateMessage() {
        const selectedCategory = userPreferences.categories[Math.floor(Math.random() * userPreferences.categories.length)];
        const categoryMessages = messages[selectedCategory];
        const message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
        return message;
    }

    function sendMessage(message) {
        // Here you can define how to send the message.
        // For demonstration, we'll append it to the chat window if Messages section is active.
        const activeSection = document.querySelector('.main-section.active');
        if (activeSection && activeSection.id === 'messagesSection') {
            const chatMessages = document.getElementById('chatMessages');
            const aiMessage = document.createElement('p');
            aiMessage.classList.add('other');
            aiMessage.innerHTML = `<strong>AI Assistant:</strong> ${escapeHTML(message)}`;
            chatMessages.appendChild(aiMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Increment message counter
            const messageCounter = document.getElementById('messageCounter');
            const currentCount = parseInt(messageCounter.textContent) || 0;
            if (currentCount < 50) {
                messageCounter.textContent = currentCount + 1;
                if (currentCount + 1 >= 50) {
                    messageCounter.classList.add('active');
                }
            } else {
                messageCounter.textContent = '50+';
                messageCounter.classList.add('active');
            }
        } else {
            alert(`GM/GN Message: ${message}`);
        }
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
