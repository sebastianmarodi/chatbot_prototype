import React from 'react';
import axios from 'axios';
const chatbotAPIUrl = 'https://your-chatbot-api-url';

//chat window component to display messages

const ChatWindow = ({ messages }) => {
    return (
      <div className="chat-window">
        {messages.map(message => (
          <div className="message">{message}</div>
        ))}
      </div>
    );
  };

//input field component for user input
const InputField = ({ userInput, setUserInput }) => {
    return (
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
    );
  };
  
  // First send button component to trigger message sending
  const FirstSendButton = ({ handleSendMessage }) => {
    return (
      <button onClick={handleSendMessage}>Send</button>
    );
  };
  
  // Second send button component to trigger message sending
  const SecondSendButton = ({ handleSendMessage }) => {
    return (
      <button onClick={handleSendMessage}>Send</button>
    );
  };
  
  // state variable to store messages
  const [messages, setMessages] = useState([]);

 // Fetch initial messages from the chatbot API:
 useEffect(() => {
    axios.get(chatbotAPIUrl)
      .then(response => {
        setMessages(response.data.messages);
      });
  }, []);

  // function to handle sending user input:
  const handleSendMessage = () => {
    axios.post(chatbotAPIUrl, {
      message: userInput,
    })
      .then(response => {
        const newMessages = [...messages, response.data.message];
        setMessages(newMessages);
        setUserInput('');
      });
  };
  //an event handler for the send button: 

  <SendButton handleSendMessage={handleSendMessage} />

// Update UI with the chatbot's response:

const newMessages = [...messages, response.data.message];
setMessages(newMessages);
setUserInput('');
