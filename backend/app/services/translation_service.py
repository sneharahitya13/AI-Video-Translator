from deep_translator import GoogleTranslator


# Supported languages
LANGUAGE_CODES = {

    "English": "en",
    "Telugu": "te",
    "Tamil": "ta",
    "Hindi": "hi",
    "Kannada": "kn",
    "Malayalam": "ml"

}



def get_language_code(language):

    if language in LANGUAGE_CODES:
        return LANGUAGE_CODES[language]

    return language



def translate_text(text, target_language):

    if not text:
        return ""


    target_language = get_language_code(target_language)


    translator = GoogleTranslator(
        source="auto",
        target=target_language
    )


    translated_text = translator.translate(text)


    return translated_text




def translate_segments(segments, target_language):

    target_language = get_language_code(target_language)


    translated_segments = []


    for segment in segments:

        translated_text = translate_text(
            segment["text"],
            target_language
        )


        translated_segments.append({

            "start": segment["start"],

            "end": segment["end"],

            "original_text": segment["text"],

            "translated_text": translated_text

        })


    return translated_segments