from app.services.transcription_service import transcribe_audio

audio = "outputs/Screen Recording 2026-03-26 at 11.19.23 AM.wav"

text = transcribe_audio(audio)

print(text)