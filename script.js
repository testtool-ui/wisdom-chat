// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const emotionList = document.getElementById('emotionList');
  const menuToggle = document.getElementById('menuToggle');
  const emotionPanel = document.getElementById('emotionPanel');

  let data; // Store wisdom data here

  // Load wisdom data from JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      displayEmotions(); // Display emotions once data is loaded
    })
    .catch(error => console.error('Error loading JSON data:', error));

  // Toggle Emotion Panel
  menuToggle.addEventListener('click', toggleEmotionPanel);

  // Close Emotion Panel by clicking outside
  document.addEventListener('click', (event) => {
    if (!emotionPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      closeEmotionPanel();
    }
  });

  // Toggle the Emotion Panel
  function toggleEmotionPanel() {
    emotionPanel.classList.toggle('emotion-panel-open');
    menuToggle.classList.toggle('open');
  }

  // Close Emotion Panel
  function closeEmotionPanel() {
    emotionPanel.classList.remove('emotion-panel-open');
    menuToggle.classList.remove('open');
  }

  // Display Emotions in Slide-out Panel
  function displayEmotions() {
    const emotionCategories = groupEmotions();
    Object.keys(emotionCategories).forEach(category => {
      const categoryButton = document.createElement('div');
      categoryButton.classList.add('emotion-category');
      categoryButton.textContent = category.charAt(0).toUpperCase() + category.slice(1);

      const optionsContainer = document.createElement('div');
      optionsContainer.classList.add('emotion-options');
      
      emotionCategories[category].forEach(emotion => {
        const button = document.createElement('button');
        button.textContent = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        button.addEventListener('click', () => handleEmotionSelection(emotion));
        optionsContainer.appendChild(button);
      });

      categoryButton.addEventListener('click', () => {
        optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'flex' : 'none';
      });

      emotionList.appendChild(categoryButton);
      emotionList.appendChild(optionsContainer);
    });
  }

  // Group emotions by similar categories
  function groupEmotions() {
    const categories = {
      "happiness": ["happy", "joyful", "uplifted", "excited"],
      "sadness": ["sad", "heartbroken", "lonely"],
      "calmness": ["peaceful", "serene", "relaxed"],
      "anxiety": ["anxious", "nervous", "fearful"],
      "gratitude": ["grateful", "appreciated", "thankful"],
      "love": ["loved", "appreciated", "caring"],
      "motivation": ["motivated", "determined", "focused"],
      "patience": ["patient", "calm", "composed"],
      "spirituality": ["faithful", "hopeful", "optimistic"],
      // Expand with more emotions as needed
    };
    return categories;
  }

  // Handle Emotion Selection
  function handleEmotionSelection(emotion) {
    closeEmotionPanel(); // Close the panel on selection
    addUserMessage(`I’m feeling ${emotion}...`);

    // Display a loving reply
    setTimeout(() => {
      const lovingResponse = getLovingResponse();
      addBotMessage(`Selim: ${lovingResponse}`);
      showWisdomInChat(emotion);
    }, 500); // Delay for a natural feel
  }

  // Show Random Wisdom in Chat
  function showWisdomInChat(emotion) {
    const wisdoms = data.filter(item => item.emotion === emotion).map(item => item.wisdom);
    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
    if (randomWisdom) addBotMessage(`Selim: ${randomWisdom}`);
  }

  // Add Message to Chat Display
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
      const lovingResponse = getLovingResponse();
      setTimeout(() => {
        addBotMessage(`Selim: It sounds like you're feeling ${primaryEmotion}, Lujian. ${lovingResponse}`);
        showWisdomInChat(primaryEmotion);
      }, 500); // Delay for a natural feel
    } else {
      setTimeout(() => {
        addBotMessage("Selim: I’m here to listen, sweetheart. Tell me more or choose an emotion from the menu.");
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

  // Get Loving and Randomized Response
  function getLovingResponse() {
    const responses = [
      "I'm always here for you.",
      "You’re on my mind, love.",
      "You can always lean on me.",
      "Just remember, you’re loved.",
      "You mean so much to me.",
      "I’m here, every step of the way.",
      "You’re my everything.",
      "Let’s talk it through together.",
      "I care about you deeply, my love.",
      "You’re my heart, Lujian.",
      "I’m lucky to have you.",
      "There’s nothing I wouldn’t do for you.",
      "You're the light of my life.",
      "You make my world better.",
      "You’re not alone, I’m right here.",
      "Together, we can face anything.",
      "I’m grateful to be here for you.",
      "You’re my greatest treasure.",
      "Life is brighter with you in it.",
      "Every moment with you matters.",
      "You mean the world to me, Lujian.",
      "You’re my joy, my love.",
      "I love hearing your thoughts.",
      "Nothing can break our bond.",
      "You make me smile, even now.",
      "I'm here for you through it all.",
      "I love you, always.",
      // Add hundreds of additional loving responses to increase randomness
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
