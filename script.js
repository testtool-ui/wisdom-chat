document.addEventListener('DOMContentLoaded', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const emotionList = document.getElementById('emotionList');
  const loadingScreen = document.getElementById('loadingScreen');
  const menuToggle = document.getElementById('menuToggle');
  const emotionPanel = document.getElementById('emotionPanel');
  const wisdomPopup = document.getElementById('wisdomPopup');
  const wisdomText = document.getElementById('wisdomText');

  let data;

  // Load wisdom data
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      displayEmotionCategories();
      loadingScreen.style.display = 'none';
    })
    .catch(error => console.error('Error loading JSON data:', error));

  // Toggle Emotion Panel
  menuToggle.addEventListener('click', toggleEmotionPanel);

  function toggleEmotionPanel() {
    emotionPanel.classList.toggle('emotion-panel-open');
    menuToggle.classList.toggle('open');
  }

  document.addEventListener('click', (e) => {
    if (emotionPanel.classList.contains('emotion-panel-open') && !emotionPanel.contains(e.target) && e.target !== menuToggle) {
      toggleEmotionPanel();
    }
  });

  // Display Emotion Categories
  function displayEmotionCategories() {
    const categories = groupEmotionsByCategory(data);
    for (const [category, emotions] of Object.entries(categories)) {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('emotion-category');
      categoryDiv.textContent = category;

      const subEmotionDiv = document.createElement('div');
      subEmotionDiv.classList.add('emotion-options');

      emotions.forEach(emotion => {
        const button = document.createElement('button');
        button.textContent = emotion;
        button.addEventListener('click', () => showWisdomPopup(emotion));
        subEmotionDiv.appendChild(button);
      });

      categoryDiv.addEventListener('click', () => {
        subEmotionDiv.style.display = subEmotionDiv.style.display === 'flex' ? 'none' : 'flex';
      });

      emotionList.appendChild(categoryDiv);
      emotionList.appendChild(subEmotionDiv);
    }
  }

  function groupEmotionsByCategory(data) {
    const categories = {
      "Positive": ["happy", "grateful", "hopeful", "excited", "motivated"],
      "Negative": ["sad", "lonely", "anxious", "angry", "frustrated"],
      "Reflective": ["nostalgic", "curious", "content", "peaceful", "thoughtful"]
    };
    return categories;
  }

  // Show Wisdom in Popup
  function showWisdomPopup(emotion) {
    const wisdoms = data.filter(item => item.emotion === emotion).map(item => item.wisdom);
    wisdomText.textContent = wisdoms[Math.floor(Math.random() * wisdoms.length)];
    wisdomPopup.classList.remove('hidden');
  }

  wisdomPopup.addEventListener('click', () => {
    wisdomPopup.classList.add('hidden');
  });

  // Add Message to Chat
  function addBotMessage(message) {
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(botMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  }

  function addUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatDisplay.appendChild(userMessage);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  }

  // Process Input for Emotion Detection
  function processInput() {
    const inputText = userInput.value.trim().toLowerCase();
    if (!inputText) return;

    addUserMessage(inputText);
    userInput.value = ''; // Clear input

    const detectedEmotions = detectEmotions(inputText);
    if (detectedEmotions.length > 0) {
      const primaryEmotion = detectedEmotions[0];
      setTimeout(() => {
        const lovingMessage = getRandomLovingResponse();
        addBotMessage(`Selim: It sounds like you're feeling ${primaryEmotion}. ${lovingMessage}`);
        showWisdomPopup(primaryEmotion);
      }, 500);
    } else {
      setTimeout(() => {
        addBotMessage("Selim: I'm here for you, Lujian. Talk to me or choose an emotion if you're unsure.");
      }, 500);
    }
  }

  // Emotion Detection with Advanced Matching
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

  function closestMatch(text, word) {
    return text.split(" ").some(part => part.startsWith(word.slice(0, 3)));
  }

  // Hundreds of Random Loving Responses
  function getRandomLovingResponse() {
    const responses = [
      "You’re amazing, Lujian.",
      "I'm here for you, always.",
      "You mean so much to me.",
      "Let’s get through this together.",
      "You can tell me anything.",
      "I’m listening, love.",
      "Just thinking about you makes me smile.",
      "I'm grateful to have you in my life.",
      "You're my happiness, Lujian.",
      "You are so special to me.",
      "Your happiness means everything to me.",
      "Tell me more, I'm all ears.",
      "Let’s make every moment beautiful together.",
      "I'm always here for you, Lujian.",
      "I just love talking to you."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Handle Send Button and Enter Key
  sendBtn.addEventListener('click', processInput);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
  });
});
