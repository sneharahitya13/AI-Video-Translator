
from app.services.video_merge_service import merge_audio_video
from app.services.translation_service import translate_text ,translate_segments
from app.services.transcription_service import transcribe_audio
from app.services.tts_service import text_to_speech
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import os
import shutil

from app.services.audio_service import extract_audio

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)





@router.post("/extract-audio")
async def extract_audio_api(
    file: UploadFile = File(...),
    language: str = Form(...)
):
    print(">>> extract_audio_api was called <<<")
    try:

        video_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            print("1")
            audio_path = extract_audio(video_path)

        print("2")
        transcription = transcribe_audio(audio_path)

        print("3")
        print(transcription)

        print("4")
        print(transcription["segments"])
        if not transcription["text"].strip():
         raise HTTPException(
            status_code=400,
            detail="Whisper could not detect any speech in the uploaded video."
    )

        print("5")
        translated = translate_segments(
            transcription["segments"],
               language
             )

        print("6")
        print(translated)
        print("7")
        translated_text = " ".join(
            item["translated_text"]
            for item in translated
)

        print("Translated text:", repr(translated_text))

            # Check if Whisper/translation produced any text
        if not translated_text.strip():
            raise HTTPException(
            status_code=400,
            detail="No speech detected in the uploaded video. Please upload a video with clear speech."
    )

        print("8")
        translated_audio = text_to_speech(
            translated_text,
            language
)
       # from app.services.video_merge_service import merge_audio_video
        final_video = merge_audio_video(
          video_path,
          translated_audio
)

        print("9")
        return {

    "message": "Video translated successfully",

    "video": video_path,

    "audio": audio_path,

    "transcription": transcription,

    "translation": translated,

    "translated_audio": translated_audio,

    "translated_video": final_video

}

    
    except Exception as e:
     import traceback

     print("\n========== ERROR ==========")
     traceback.print_exc()
     print("===========================\n")

     raise HTTPException(
        status_code=500,
        detail=str(e)
    ) 




@router.post("/translate")
async def translate_api(
    text: str = Form(...),
    language: str = Form(...)
):
    translated = translate_text(text, language)

    return {
        "original": text,
        "translated": translated}