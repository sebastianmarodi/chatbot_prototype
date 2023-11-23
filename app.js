import React, { useState, useEffect } from 'react';
import axios from 'axios';
const chatbotAPIUrl = 'https://your-chatbot-api-url';

// Chat window component to display messages with timestamps
const ChatWindow = ({ messages }) => (
  <div className="chat-window">
    {messages.map((message) => (
      <div className="message">
        <span className="timestamp">{message.timestamp}</span>
        <span className={message.type === 'user' ? 'user-message' : 'bot-message'}>
          {message.text}
        </span>
      </div>
    ))}
  </div>
);

// Input field component with autocompletion and suggestion feature
const InputField = ({ userInput, setUserInput, suggestions }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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

  return (
    <>
      <input
        type="text"
        className="input-field"
        value={userInput}
        onChange={handleInputChange}
      />
      {filteredSuggestions.length > 0 && (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion) => (
            <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

// Send button component with feedback and error handling
const SendButton = ({ handleSendMessage, isSending, error }) => {
  const handleSendButtonClick = () => {
    handleSendMessage();
  };

  return (
    <button
      className="send-button"
      onClick={handleSendButtonClick}
      disabled={isSending || error}
    >
      Send
    </button>
  );
};

// State variable to store messages, user input, and suggestions
const [messages, setMessages] = useState([]);
const [userInput, setUserInput] = useState('');
const [suggestions, setSuggestions] = useState([]);

// Fetch initial messages and suggestions from the chatbot API
useEffect(() => {
  axios.get(chatbotAPIUrl + '/messages')
    .then((response) => setMessages(response.data.messages));

  axios.get(chatbotAPIUrl + '/suggestions')
    .then((response) => setSuggestions(response.data.suggestions));
}, []);

// Function to handle sending user input
const handleSendMessage = () => {
  if (userInput.length === 0) {
    return;
  }

  axios.post(chatbotAPIUrl, {
    message: userInput,
  })
    .then((response) => {
      const newMessages = [...messages, response.data.message];
      setMessages(newMessages);
      setUserInput('');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
};

// Update UI with the chatbot's response and handle errors
useEffect(() => {
  axios.get(`${chatbotAPIUrl}/messages?latest=true`)
    .then((response) => {
      if (response.data.message) {
        const newMessages = [...messages, response.data.message];
        setMessages(newMessages);
      }
    })
    .catch((error) => {
      console.error('Error updating messages:', error);
    });
}, [messages.length]);

// Render the chatbot UI
return (
  <>
    <div className="chatbot-container">
      <ChatWindow messages={messages} />
      <InputField userInput={userInput} setUserInput={setUserInput} suggestions={suggestions} />
      <SendButton handleSendMessage={handleSendMessage} isSending={false} error={false} />
    </div>
  </>
);

