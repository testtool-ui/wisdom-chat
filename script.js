document.addEventListener('DOMContentLoaded', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const emotionList = document.getElementById('emotionList');
  const menuToggle = document.getElementById('menuToggle');
  const emotionPanel = document.getElementById('emotionPanel');

  let data;

  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData.filter(item => item.wisdom); // Filter to include only emotions with wisdom
      displayEmotions();
    })
    .catch(error => console.error('Error loading JSON data:', error));

  menuToggle.addEventListener('click', toggleEmotionPanel);

  document.addEventListener('click', (event) => {
    if (!emotionPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      closeEmotionPanel();
    }
  });

  function toggleEmotionPanel() {
    emotionPanel.classList.toggle('emotion-panel-open');
    menuToggle.classList.toggle('open');
  }

  function closeEmotionPanel() {
    emotionPanel.classList.remove('emotion-panel-open');
    menuToggle.classList.remove('open');
  }

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
        // Close all other options, and toggle this one
        document.querySelectorAll('.emotion-options').forEach(container => container.style.display = 'none');
        if (optionsContainer.style.display === 'none' || optionsContainer.style.display === '') {
          optionsContainer.style.display = 'flex';
        } else {
          optionsContainer.style.display = 'none';
        }
      });

      emotionList.appendChild(categoryButton);
      emotionList.appendChild(optionsContainer);
    });
  }

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
    };

    // Filter out any emotions that don't have wisdom in the dataset
    Object.keys(categories).forEach(category => {
      categories[category] = categories[category].filter(emotion => data.some(item => item.emotion === emotion));
    });

    return categories;
  }

  function handleEmotionSelection(emotion) {
    closeEmotionPanel();
    addUserMessage(`I’m feeling ${emotion}...`);

    setTimeout(() => {
      const lovingResponse = getLovingResponse();
      addBotMessage(`Selim: ${lovingResponse}`);
      showWisdomInChat(emotion);
    }, 500);
  }

  function showWisdomInChat(emotion) {
    const wisdoms = data.filter(item => item.emotion === emotion).map(item => item.wisdom);
    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
    if (randomWisdom) addBotMessage(`Selim: ${randomWisdom}`);
  }

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

  function processInput() {
    const inputText = userInput.value.trim().toLowerCase();
    if (!inputText) return;

    addUserMessage(inputText);
    userInput.value = '';

    const detectedEmotions = detectEmotions(inputText);
    if (detectedEmotions.length > 0) {
      const primaryEmotion = detectedEmotions[0];
      const lovingResponse = getLovingResponse();
      setTimeout(() => {
        addBotMessage(`Selim: It sounds like you're feeling ${primaryEmotion}, Lujian. ${lovingResponse}`);
        showWisdomInChat(primaryEmotion);
      }, 500);
    } else {
      setTimeout(() => {
        addBotMessage(getRandomUnrecognizedResponse());
      }, 500);
    }
  }

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
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  function getRandomUnrecognizedResponse() {
    const responses = [
      "I'm here for you, love. Tell me more or pick an emotion that matches your feelings.",
      "I may not fully understand, but I'm listening closely, darling. You can always try selecting an emotion.",
      "I’m right here, love. Share what’s on your mind, or pick an emotion to help express yourself.",
      "I’m all ears, Lujian. Let me know how you’re feeling, or select an emotion from the menu.",
      "I’ll always be here to listen. Tell me more, sweetheart, or try choosing an emotion.",
      "You're never alone with me here. Share anything you like, or pick an emotion if you need a bit of guidance.",
      // Add many more random entries to create a vast pool of unrecognized responses
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  sendBtn.addEventListener('click', processInput);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
  });
});
