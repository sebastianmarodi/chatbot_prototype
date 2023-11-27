import React, {useState} from 'react';
import './App.css';
import logo from './assets/medi-guide-logo.svg'
import add_button from './assets/add-30.png'
import msg_icon from './assets/message.svg' 
import home from './assets/home.svg'
import saved from './assets/bookmark.svg'
import pro from './assets/rocket.svg'
import send_icon from './assets/send.svg'
import user_icon from './assets/user-icon.png'

const App = () => {
  const api_url ='https://6cb1-197-184-176-149.ngrok-free.app/chat'
  const [userInput, setUserInput] = useState('');

  const sendChatRequest = async () => {
    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Assuming the API response contains a field named 'output'
      const chatbotResponse = data;

      // Do something with the chatbot response
      console.log(chatbotResponse);

      return chatbotResponse;
    } catch (error) {
      console.error('Error:', error);
      // Handle errors appropriately
      throw error;
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };
  
  const handleSendClick = () => {
    // Call the sendChatRequest function when the send button is clicked
    sendChatRequest(userInput);
     // Clear the input field after sending the request
     setUserInput('');
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="site-identity"> 
            <img src={logo} alt="logo" className="logo"/>
            <span>Medi-Guide</span>
          </div>
          <button className="mid-btn">
            <img  src={add_button} alt="" className="add-btn"/>
            New Chat
          </button>
          <div className="chat-history">
              <button className="query-btn"><img src={msg_icon} alt="query"/>
              What is Programming?
              </button>
              <button className="query-btn"><img src={msg_icon} alt="query"/>
              What is Programming?
              </button>
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="menu-list">
            <div className="menu-list-item">
              <img src={home} alt="" className="menu-list-icon"/>Home
            </div>
            <div className="menu-list-item">
              <img src={saved} alt="" className="menu-list-icon"/>Saved
            </div>
            <div className="menu-list-item">
              <img src={pro} alt="" className="menu-list-icon"/>Go Pro
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chat-window">
          <div className="chat-bubble">
            <img src={user_icon} className="chat-avatar" alt=""/>
            <p className="txt">Lorem1 ipsum dolor sit amet</p>
          </div>
          <div className="chat-bubble bot">
            <img src={logo} className="chat-avatar" alt=""/>
            <p className="txt">
              Lorem1 ipsum dolor sit amet.
              In this tutorial we are going
              to create our own ChatGPT in 
              React with the help of OpanAI API. 
              This ChatGPT clone works same as 
              the real ChatGPT app or website. 
              In this Clone of ChatGPT we don't 
              need to create an account. 
              We can directly open this ChatGPT 
              clone web app and search for our query. 
              The ChatGPT clone will given the answer 
              of all our queries using AI API. </p>
          </div>
        </div>
        <div className="chat-footer">
          <div className="input-section">
            <input
              id="user-input"
              name="chat" 
              type="text"  
              placeholder="Input your query here..."
              value={userInput}
              onChange={handleInputChange}/>
            <button className="send" onClick={handleSendClick}>
              <img src={send_icon} alt="send button"/>
            </button>
          </div>
          <p>Medi-Guide is an automated system, 
            and it may not always provide 100% accurate 
            information. The information provided by 
            Medi-Guide is not intended to be a substitute 
            for professional medical advice, diagnosis, 
            or treatment. 
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
