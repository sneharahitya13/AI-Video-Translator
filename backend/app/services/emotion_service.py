from transformers import pipeline


# Load the emotion detection model
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)


def detect_emotion(text):

    if not text or not text.strip():
        return {
            "emotion": "neutral",
            "confidence": 0.0
        }

    result = emotion_classifier(text)[0]

    return {
        "emotion": result["label"],
        "confidence": result["score"]
    }