import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition

app = Flask(__name__)
CORS(app)

KNOWN_FACES_DIR = "known_faces"
known_faces = []
known_names = []

# Load known faces
def load_known_faces():
    for name in os.listdir(KNOWN_FACES_DIR):
        for filename in os.listdir(f"{KNOWN_FACES_DIR}/{name}"):
            image = face_recognition.load_image_file(f"{KNOWN_FACES_DIR}/{name}/{filename}")
            encoding = face_recognition.face_encodings(image)[0]
            known_faces.append(encoding)
            known_names.append(name)

load_known_faces()

@app.route("/register", methods=["POST"])
def register():
    if "file" not in request.files or "name" not in request.form or "email" not in request.form or "password" not in request.form or "role" not in request.form:
        return jsonify({"error": "Missing data"}), 400

    file = request.files["file"]
    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]
    role = request.form["role"]

    # Create a directory for the user if it doesn't exist
    user_dir = os.path.join(KNOWN_FACES_DIR, name)
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    # Save the uploaded photo
    file_path = os.path.join(user_dir, file.filename)
    file.save(file_path)

    # Add face encoding to known faces
    image = face_recognition.load_image_file(file_path)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return jsonify({"error": "No face found in the uploaded image"}), 400

    encoding = encodings[0]
    known_faces.append(encoding)
    known_names.append(name)

    return jsonify({"message": "User registered successfully"})

if __name__ == "__main__":
    app.run(debug=True)
