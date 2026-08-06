from gtts import gTTS
import os
import traceback

try:
    print("Current directory:", os.getcwd())

    tts = gTTS(text="Hello, this is a test.", lang="en")
    print("gTTS object created.")

    print("Saving...")
    tts.save("test.mp3")

    print("Saved successfully!")
    print("File exists:", os.path.exists("test.mp3"))

except Exception as e:
    print("\nERROR:")
    traceback.print_exc()