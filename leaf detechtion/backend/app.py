from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('model/plant_disease_model.h5')
labels = ["Apple Scab", "Healthy", "Late Blight", "Leaf Spot", "Rust"]

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    image = Image.open(file.stream).resize((224, 224))
    image = np.expand_dims(np.array(image) / 255.0, axis=0)

    prediction = model.predict(image)
    class_index = np.argmax(prediction)
    disease = labels[class_index]

    treatment_suggestions = {
        "Apple Scab": "Use fungicide sprays and remove infected leaves.",
        "Healthy": "No disease detected. Keep monitoring.",
        "Late Blight": "Apply copper-based fungicides and remove infected plants.",
        "Leaf Spot": "Prune affected leaves and avoid overhead watering.",
        "Rust": "Use sulfur-based fungicides and improve air circulation.",
    }

    return jsonify({
        "disease": disease,
        "treatment": treatment_suggestions[disease]
    })

if __name__ == "__main__":
    app.run(debug=True)


// backend/requirements.txt
Flask
flask-cors
tensorflow
Pillow
numpy