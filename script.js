// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const emotionSelection = document.getElementById('emotionSelection');
  const themeToggle = document.getElementById('themeToggle');
  const loadingScreen = document.getElementById('loadingScreen');

  let data; // Store wisdom data here

  // Load wisdom data from JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      displayEmotions(); // Display emotions once data is loaded
      loadingScreen.style.display = 'none'; // Hide loading screen
    })
    .catch(error => console.error('Error loading JSON data:', error));

  // Toggle Dark Mode
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });

  // Display Emotions as Buttons
  function displayEmotions() {
    emotionSelection.innerHTML = '<p>Or, pick an emotion:</p>';
    data.forEach(item => {
      const button = document.createElement('button');
      button.textContent = item.emotion;
      button.addEventListener('click', () => showWisdom(item.emotion));
      emotionSelection.appendChild(button);
    });
  }

  // Show wisdom based on emotion
  function showWisdom(emotion) {
    const wisdom = data.find(item => item.emotion === emotion)?.wisdom;
    if (wisdom) addBotMessage(wisdom);
  }

  // Add a message to the chat display
  function addBotMessage(message) {
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(botMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to the latest message
  }

  // Process user input and suggest an emotion
  function processInput() {
    const inputText = userInput.value.trim().toLowerCase();
    if (!inputText) return;

    addUserMessage(inputText);

    const detectedEmotion = data.find(item => inputText.includes(item.emotion));
    if (detectedEmotion) {
      setTimeout(() => {
        addBotMessage(`It seems you might be feeling ${detectedEmotion.emotion}. Here’s some wisdom for you:`);
        showWisdom(detectedEmotion.emotion);
      }, 500); // Slight delay for a natural feel
    } else {
      setTimeout(() => addBotMessage("I'm here for you. Please choose an emotion or try describing how you feel."), 500);
    }

    userInput.value = ''; // Clear the input field
  }

  // Add user's message to the chat display
  function addUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(userMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  }

  // Handle send button click
  sendBtn.addEventListener('click', processInput);

  // Handle Enter key press in input field
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
  });
});
