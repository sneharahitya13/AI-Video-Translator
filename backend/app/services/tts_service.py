from gtts import gTTS
import os
import uuid


OUTPUT_FOLDER = "outputs"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)



def text_to_speech(text, language):

    if not text:
        raise ValueError("No text provided for speech generation")


    filename = f"translated_audio_{uuid.uuid4()}.mp3"

    output_path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )


    speech = gTTS(
        text=text,
        lang=language,
        slow=False
    )


    speech.save(output_path)


    return output_path