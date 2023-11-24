import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatApp = () => {
  const chatbotAPIUrl = 'https://your-chatbot-api-url';

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userName, setUserName] = useState('');
  const [userPreferences, setUserPreferences] = useState({
    messageColor: '#2196F3',
    botMessageColor: '#212121',
    inputFieldColor: '#FFFFFF',
    sendButtonColor: '#2196F3',
    enableEmojis: true,
    enableVoiceInput: false, // Remove this line to disable voice input
  });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const inputText = event.target.value;
    setUserInput(inputText);

    if (inputText.length > 2) {
      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(inputText.toLowerCase())
      );
      setFilteredSuggestions(filteredSuggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    setFilteredSuggestions([]);
  };

  const handleSendButtonClick = () => {
    if (userInput.trim()) {
      setIsSending(true);

      axios
        .post(chatbotAPIUrl, {
          message: userInput,
        })
        .then((response) => {
          const newMessage = {
            text: response.data.message,
            type: 'bot',
            timestamp: new Date().toLocaleTimeString(),
          };

          setMessages([...messages, newMessage]);
          setUserInput('');
          setIsSending(false);
        })
        .catch((error) => {
          setError(error);
          setIsSending(false);
        });
    }
  };

  useEffect(() => {
    // Fetch initial suggestions or other data
    // Example:
    axios.get('https://your-suggestions-api-url')
      .then((response) => {
        setSuggestions(response.data.suggestions);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  }, []);

  return (
    <div>
      {/* Render your components here, including ChatWindow, InputField, and SendButton */}
    </div>
  );
};

export default ChatApp;
