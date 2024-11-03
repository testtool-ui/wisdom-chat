// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const emotionList = document.getElementById('emotionList');
  const themeToggle = document.getElementById('themeToggle');
  const loadingScreen = document.getElementById('loadingScreen');
  const menuToggle = document.getElementById('menuToggle');
  const emotionPanel = document.getElementById('emotionPanel');

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

  // Toggle Emotion Panel
  menuToggle.addEventListener('click', () => {
    emotionPanel.classList.toggle('emotion-panel-open');
  });

  // Display Emotions in Slide-out Panel
  function displayEmotions() {
    data.forEach(item => {
      const button = document.createElement('button');
      button.textContent = item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1);
      button.addEventListener('click', () => showRandomWisdom(item.emotion));
      emotionList.appendChild(button);
    });
  }

  // Show Randomized Wisdom for Emotion
  function showRandomWisdom(emotion) {
    const wisdoms = data.filter(item => item.emotion === emotion).map(item => item.wisdom);
    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
    if (randomWisdom) addBotMessage(`Selim: ${randomWisdom}`);
  }

  // Add a message to the chat display
  function addBotMessage(message) {
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(botMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to the latest message
  }

  // Add User's Message
  function addUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(userMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  }

  // Process User Input for Emotion Analysis
  function processInput() {
    const inputText = userInput.value.trim().toLowerCase();
    if (!inputText) return;

    addUserMessage(inputText);
    userInput.value = ''; // Clear the input field

    const detectedEmotions = detectEmotions(inputText);
    if (detectedEmotions.length > 0) {
      const primaryEmotion = detectedEmotions[0];
      const additionalResponse = getRandomResponse();
      setTimeout(() => {
        addBotMessage(`Selim: It sounds like you're feeling ${primaryEmotion}. ${additionalResponse}`);
        showRandomWisdom(primaryEmotion);
      }, 500); // Delay for a natural feel
    } else {
      setTimeout(() => {
        addBotMessage("Selim: Hmm, I'm here for you, Lujian. Tell me more or choose an emotion from the menu.");
      }, 500);
    }
  }

  // Detect Emotions from User Input
  function detectEmotions(text) {
    const detected = [];
    data.forEach(item => {
      const emotion = item.emotion.toLowerCase();
      if (text.includes(emotion) || closestMatch(text, emotion)) {
        detected.push(emotion);
      }
    });
    return Array.from(new Set(detected));
  }

  // Simple Closest Match for Spelling Variations
  function closestMatch(text, word) {
    return text.split(" ").some(part => part.startsWith(word.slice(0, 3)));
  }

  // Get Randomized Boyfriend-like Response
  function getRandomResponse() {
    const responses = [
      "I'm here for you always.",
      "You mean so much to me, Lujian.",
      "Let's get through this together.",
      "You can tell me anything.",
      "I'm listening, love."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Handle Send Button Click
  sendBtn.addEventListener('click', processInput);

  // Handle Enter Key Press in Input Field
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
  });
});
