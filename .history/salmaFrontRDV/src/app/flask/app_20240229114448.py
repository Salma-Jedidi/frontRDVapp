from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

@app.route('/api/test/connection', methods=['GET'])
def test_connection():
    print('Received connection test request')
    return jsonify(message='Connection test successful!')


@app.route('/api', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            data = request.get_json()
            msg = request.json["msg"]
            print(f"Received message: {msg}")
            response = get_chat_response(msg)
            print(f"Sending response: {response}")
            return jsonify(response=response)
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error
            return jsonify(error=str(e)), 500
    else:
        return render_template('chat/chat.component.html')


@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('src/assets', path)

import json


file_path = r'C:\Users\21623\Downloads\ProjetRDV\front-gestion-RDV\src\flask\conversation.json'

with open(file_path, 'r') as json_file:
    conversation_data = json.load(json_file)

def get_chat_response(text):
    # Find the corresponding bot response in the loaded JSON data
    for pair in conversation_data["messages"]:
        user_words = set(pair["user"].lower().split())
        input_words = set(text.lower().split())

        if any(word in input_words for word in user_words):
            bot_response = pair["bot"]
            break
    else:
        # If no predefined response found, use a default response
        bot_response = "Je suis désolé, Je n'ai pas la réponse spécifique pour ça."

    # Append user input to the conversation history
    user_message = {"user": text, "bot": bot_response}
    conversation_data["messages"].append(user_message)

    print(f"Received message: {text}")
    print(f"Sending response: {bot_response}")

    return bot_response

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(port=5001)