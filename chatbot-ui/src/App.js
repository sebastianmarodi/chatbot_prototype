import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/medi-guide-logo.svg';
import send_icon from './assets/send.svg';
import user_icon from './assets/user-icon.png';
import axios from 'axios';

const App = () => {
  const api_url = 'https://6cb1-197-184-176-149.ngrok-free.app/chat';
  const [userInput, setUserInput] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch previous chats on component mount
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(api_url);
      setChats(response.data); // Assuming your API returns an array of chat messages
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const sendChatRequest = async () => {
    try {
      // Assuming your API endpoint for sending messages is 'YOUR_API_ENDPOINT/send'
      await axios.post(api_url, { user_input: userInput });
      // Update the chat after sending the message
      fetchChats();
      // Clear the input field after sending the request
      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle errors appropriately
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendClick = () => {
    sendChatRequest();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatRequest();
    }
  };

  return (
    <div className="App">
      <div className="main">
        <div className="site-identity">
          <img src={logo} alt="logo" className="logo" />
          <span>Medi-Guide</span>
        </div>
        <div className="chat-window">
          {/* Display conversation between chat agent and user */}
          {chats.map((chat, index) => (
            <div key={index} className={`chat-bubble ${chat.sender === 'user' ? '' : 'bot'}`}>
              <img src={chat.sender === 'user' ? user_icon : logo} className="chat-avatar" alt="" />
              <p className="txt">{chat.message}</p>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <div className="input-section">
            <input
              id="user-input"
              name="chat"
              type="text"
              placeholder="Input your query here..."
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button className="send" onClick={handleSendClick}>
              <img src={send_icon} alt="send button" />
            </button>
          </div>
          <p>Medi-Guide is an automated system, and it may not always provide 100% accurate information. The information provided by Medi-Guide is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
