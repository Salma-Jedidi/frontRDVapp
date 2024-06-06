# Install necessary packages
# pip install Flask flask-cors face_recognition numpy

from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Assuming you have a folder 'known_faces' with images of registered users
KNOWN_FACES_DIR = "known_faces"
known_faces = []
known_names = []

# Load known faces
for name in os.listdir(KNOWN_FACES_DIR):
    for filename in os.listdir(f"{KNOWN_FACES_DIR}/{name}"):
        image = face_recognition.load_image_file(f"{KNOWN_FACES_DIR}/{name}/{filename}")
        encoding = face_recognition.face_encodings(image)[0]
        known_faces.append(encoding)
        known_names.append(name)

@app.route("/register", methods=["POST"])
def register():
    file = request.files["file"]
    name = request.form["name"]
    role = request.form["role"]

    # Save the file
    path = os.path.join(KNOWN_FACES_DIR, name)
    if not os.path.exists(path):
        os.makedirs(path)
    file.save(os.path.join(path, file.filename))

    # Add face encoding
    image = face_recognition.load_image_file(os.path.join(path, file.filename))
    encoding = face_recognition.face_encodings(image)[0]
    known_faces.append(encoding)
    known_names.append(name)
    return jsonify({"message": "User registered successfully"})

@app.route("/login", methods=["POST"])
def login():
    file = request.files["file"]
    image = face_recognition.load_image_file(file)
    unknown_encoding = face_recognition.face_encodings(image)[0]

    results = face_recognition.compare_faces(known_faces, unknown_encoding)
    if True in results:
        match_index = results.index(True)
        name = known_names[match_index]
        return jsonify({"message": f"Welcome {name}"})
    else:
        return jsonify({"message": "Face not recognized"}), 401

if __name__ == "__main__":
    app.run(debug=True)
