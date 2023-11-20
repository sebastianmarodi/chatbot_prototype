from flask import Flask, request, jsonify
from flask import Flask, render_template, request
from chatbot import get_response
app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
  # Receive input from client
  user_input = request.json.get('user_input')

  # Process user_input with your chatbot
  # ...
  # Get chatbot's response
  chatbot_response = get_response(user_input)
  response = chatbot_response['output']
  #response.mimetype = "text/plain"
  return response

if __name__ == '__main__':
    app.run(debug=True)
