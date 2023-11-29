from flask import Flask, request
from flask_cors import CORS
from chatbot import get_response

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
  # Receive input from client
  user_input = request.json.get('user_input')

  # Process user_input with your chatbot
  # ...
  # Get chatbot's response
  chatbot_response = get_response(user_input)
  response = chatbot_response
  #response.mimetype = "text/plain"
  return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)