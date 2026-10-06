from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import os
import shutil

from app.services.video_merge_service import merge_audio_video
from app.services.translation_service import (
    translate_text,
    translate_segments
)
from app.services.transcription_service import transcribe_audio
from app.services.tts_service import text_to_speech
from app.services.emotion_service import detect_emotion
from app.services.audio_service import (
    extract_audio,
    enhance_audio
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

WHISPER_LANGUAGE_MAP = {
    "en": "English",
    "te": "Telugu",
    "ta": "Tamil",
    "kn": "Kannada",
    "ml": "Malayalam",
    "hi": "Hindi"
}

SUPPORTED_LANGUAGES = {
    "English",
    "Telugu",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Hindi"
}
LANGUAGE_CODE_TO_NAME = {
    "en": "English",
    "te": "Telugu",
    "ta": "Tamil",
    "kn": "Kannada",
    "ml": "Malayalam",
    "hi": "Hindi"
}

@router.post("/extract-audio")
async def extract_audio_api(
    file: UploadFile = File(...),
    language: str = Form(...)
):

    print(">>> extract_audio_api was called <<<")
    print("Received target language:", language)
    

    try:
        if language in LANGUAGE_CODE_TO_NAME:
           language = LANGUAGE_CODE_TO_NAME[language]

           print("Target language:", language)

        if language not in SUPPORTED_LANGUAGES:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported target language: {language}. "
                    f"Supported languages: "
                    f"{', '.join(SUPPORTED_LANGUAGES)}"
                )
            )

        print("Target language:", language)

        video_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(
            video_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        print(
            "1 - Video uploaded:",
            video_path
        )

        audio_path = extract_audio(
            video_path
        )

        print(
            "Original audio extracted:",
            audio_path
        )

        enhanced_audio_path = enhance_audio(
            audio_path
        )

        print(
            "Enhanced audio created:",
            enhanced_audio_path
        )

        print(
            "2 - Audio extracted:",
            audio_path
        )

        transcription = transcribe_audio(
            enhanced_audio_path
        )

        print(
            "3 - Transcription completed"
        )

        print(
            "Transcription:",
            transcription
        )

        if not transcription["text"].strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "Whisper could not detect any speech "
                    "in the uploaded video."
                )
            )

        print("4 - Speech detected")

        detected_language_code = transcription.get(
            "language"
        )

        print(
            "Whisper detected language code:",
            detected_language_code
        )

        source_language = WHISPER_LANGUAGE_MAP.get(
            detected_language_code
        )

        if source_language is None:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Detected language "
                    f"'{detected_language_code}' "
                    f"is not currently supported."
                )
            )

        print(
            "Source language:",
            source_language
        )

        print(
            "Target language:",
            language
        )

        emotion_result = detect_emotion(
            transcription["text"]
        )

        print(
            "5 - Detected emotion:",
            emotion_result
        )

        translated = translate_segments(
            transcription["segments"],
            source_language,
            language
        )

        print(
            "6 - Translation completed"
        )

        print(
            "Translated segments:",
            translated
        )

        translated_text = " ".join(
            item["translated_text"]
            for item in translated
        )

        print(
            "Translated text:",
            repr(translated_text)
        )

        if not translated_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "No translated speech was generated. "
                    "Please upload a video with clear speech."
                )
            )

        print("7 - Valid translated text")

        emotion = emotion_result.get(
            "emotion",
            "neutral"
        )

        print(
            "Emotion passed to TTS:",
            emotion
        )

        translated_audio = text_to_speech(
            translated_text,
            language,
            emotion
        )

        print(
            "8 - Emotion-aware audio generated:",
            translated_audio
        )

        final_video = merge_audio_video(
            video_path,
            translated_audio
        )

        print(
            "9 - Final video created:",
            final_video
        )

        return {
            "message": "Video translated successfully",
            "source_language": source_language,
            "source_language_code": detected_language_code,
            "target_language": language,
            "video": video_path,
            "audio": audio_path,
            "enhanced_audio": enhanced_audio_path,
            "transcription": transcription,
            "translation": translated,
            "translated_text": translated_text,
            "translated_audio": translated_audio,
            "translated_video": final_video,
            "emotion": emotion_result["emotion"],
            "emotion_confidence": emotion_result["confidence"]
        }

    except HTTPException:

        raise

    except Exception as e:

        import traceback

        print(
            "\n========== ERROR =========="
        )

        traceback.print_exc()

        print(
            "===========================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/translate")
async def translate_api(
    text: str = Form(...),
    source_language: str = Form(...),
    target_language: str = Form(...)
):

    try:

        if source_language not in SUPPORTED_LANGUAGES:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported source language: "
                    f"{source_language}"
                )
            )

        if target_language not in SUPPORTED_LANGUAGES:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported target language: "
                    f"{target_language}"
                )
            )

        translated = translate_text(
            text,
            source_language,
            target_language
        )

        return {
            "original": text,
            "source_language": source_language,
            "target_language": target_language,
            "translated": translated
        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )