from gtts import gTTS
import os
import uuid
import subprocess


OUTPUT_FOLDER = "outputs"

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)
LANGUAGE_CODES = {
    "English": "en",
    "Telugu": "te",
    "Tamil": "ta",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Hindi": "hi"
}


def text_to_speech(
    text,
    language,
    emotion="neutral"
):

    if not text:
        raise ValueError(
            "No text provided for speech generation"
        )

    unique_id = uuid.uuid4().hex

    raw_filename = (
        f"raw_audio_{unique_id}.mp3"
    )

    final_filename = (
        f"translated_audio_{unique_id}.mp3"
    )

    raw_path = os.path.join(
        OUTPUT_FOLDER,
        raw_filename
    )

    output_path = os.path.join(
        OUTPUT_FOLDER,
        final_filename
    )

   

    language_code = LANGUAGE_CODES.get(
       language,
        language
)

    speech = gTTS(
       text=text,
       lang=language_code,
       slow=False
)
        



    speech.save(raw_path)

    print(
        "Normal translated speech created:",
        raw_path
    )


    emotion = emotion.lower().strip()


    emotion_settings = {

        "joy": {
            "speed": 1.12,
            "pitch": 2,
            "volume": 1.15
        },

        "sadness": {
            "speed": 0.85,
            "pitch": -2,
            "volume": 0.80
        },

        "anger": {
            "speed": 1.08,
            "pitch": 1,
            "volume": 1.25
        },

        "fear": {
            "speed": 1.15,
            "pitch": 3,
            "volume": 1.00
        },

        "surprise": {
            "speed": 1.18,
            "pitch": 4,
            "volume": 1.15
        },

        "disgust": {
            "speed": 0.95,
            "pitch": -1,
            "volume": 1.05
        },

        "neutral": {
            "speed": 1.00,
            "pitch": 0,
            "volume": 1.00
        }
    }

    settings = emotion_settings.get(
        emotion,
        emotion_settings["neutral"]
    )

    speed = settings["speed"]
    pitch = settings["pitch"]
    volume = settings["volume"]

    print(
        f"Detected emotion: {emotion}"
    )

    print(
        f"Applying emotion settings: "
        f"speed={speed}, "
        f"pitch={pitch}, "
        f"volume={volume}"
    )

   

    filters = []

    # Pitch modification
    if pitch != 0:

        pitch_factor = 2 ** (
            pitch / 12
        )

        filters.append(
            f"asetrate=24000*{pitch_factor}"
        )

        filters.append(
            "aresample=24000"
        )

    # Speech speed
    filters.append(
        f"atempo={speed}"
    )

    # Volume
    filters.append(
        f"volume={volume}"
    )

    filter_chain = ",".join(filters)

    

    command = [

        "ffmpeg",

        "-y",

        "-i",
        raw_path,

        "-filter:a",
        filter_chain,

        "-codec:a",
        "libmp3lame",

        "-q:a",
        "2",

        output_path
    ]

    print(
        "Applying emotion processing..."
    )

    subprocess.run(
        command,
        check=True
    )


    if os.path.exists(raw_path):

        os.remove(
            raw_path
        )

    print(
        "Emotion-aware audio created:",
        output_path
    )

    return output_path