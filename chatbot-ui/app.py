import os
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv 
from chatbot import get_response

def config():
  load_dotenv()

config()

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": os.getenv("CORS_ORIGIN")}})

@app.route('/chat', methods=['POST'])
def chat():
  # Receive input from client
  user_input = request.json.get('user_input')
  # Process user_input with your chatbot
  # ...
  # Get chatbot's response
  #response.mimetype = "text/plain"
  return get_response(user_input)

if __name__ == '__main__':
    app.run(port=5000)