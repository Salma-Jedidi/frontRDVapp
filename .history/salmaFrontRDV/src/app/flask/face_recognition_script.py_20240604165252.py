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
    if not os.path.exists(KNOWN_FACES_DIR):
        os.makedirs(KNOWN_FACES_DIR)
    for name in os.listdir(KNOWN_FACES_DIR):
        user_dir = os.path.join(KNOWN_FACES_DIR, name)
        if not os.path.isdir(user_dir):
            continue
        for filename in os.listdir(user_dir):
            file_path = os.path.join(user_dir, filename)
            image = face_recognition.load_image_file(file_path)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                encoding = encodings[0]
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

@app.route("/login", methods=["POST"])
def login():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    image = face_recognition.load_image_file(file)
    unknown_encoding = face_recognition.face_encodings(image)

    if not unknown_encoding:
        return jsonify({"error": "No face found in the uploaded image"}), 400

    unknown_encoding = unknown_encoding[0]
    results = face_recognition.compare_faces(known_faces, unknown_encoding)
    if True in results:
        match_index = results.index(True)
        name = known_names[match_index]
        return jsonify({"message": f"Welcome {name}"})
    else:
        return jsonify({"message": "Face not recognized"}), 401

if __name__ == "__main__":
    app.run(debug=True)
