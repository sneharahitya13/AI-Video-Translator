from app.services.emotion_service import detect_emotion


text = "I am so happy! We finally completed the project!"

result = detect_emotion(text)

print(result)