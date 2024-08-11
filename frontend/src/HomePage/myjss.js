document.getElementById('chatToggle').addEventListener('click', function() {
    var chatbox = document.getElementById('chatbox');
    chatbox.style.display = chatbox.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        var userInput = document.getElementById('userInput').value;
        var messages = document.getElementById('messages');

        // Display user message
        var userMessage = document.createElement('div');
        userMessage.textContent = 'You: ' + userInput;
        messages.appendChild(userMessage);

        // Send the user message to the chatbot API
        fetch('https://medicarebot.onrender.com/consult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        })
        .then(response => response.json())
        .then(data => {
            // Display bot response
            var botMessage = document.createElement('div');
            botMessage.textContent = 'Bot: ' + data.response;
            messages.appendChild(botMessage);

            // Scroll to the latest message
            messages.scrollTop = messages.scrollHeight;
        })
        .catch(error => console.error('Error:', error));

        // Clear the input field
        document.getElementById('userInput').value = '';
    }
});
