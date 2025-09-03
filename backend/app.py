import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from resume_analyzer import analyze_resume
from chat_service import chat_response

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return {"message": "Backend is running"}

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(path)
    result = analyze_resume(path)
    return jsonify(result)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "message is required"}), 400
    reply = chat_response(message)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
