# backend/app/services/translation_service.py

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM




MODEL_NAME = "facebook/nllb-200-distilled-600M"





LANGUAGE_CODES = {
    "English": "eng_Latn",
    "Telugu": "tel_Telu",
    "Tamil": "tam_Taml",
    "Kannada": "kan_Knda",
    "Malayalam": "mal_Mlym",
    "Hindi": "hin_Deva",
}




print("Loading NLLB translation model...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME
)

print("NLLB model loaded successfully.")




def get_language_code(language: str) -> str:

    if not language:
        raise ValueError(
            "Target language is required."
        )

    language = language.strip()

    
    if language in LANGUAGE_CODES:
        return LANGUAGE_CODES[language]

    
    if language in LANGUAGE_CODES.values():
        return language

    raise ValueError(
        f"Unsupported language: {language}. "
        f"Supported languages: "
        f"{', '.join(LANGUAGE_CODES.keys())}"
    )




def translate_text(
    text: str,
    source_language: str,
    target_language: str
) -> str:

    if not text or not text.strip():
        return ""

    source_code = get_language_code(
        source_language
    )

    target_code = get_language_code(
        target_language
    )

    
    if source_code == target_code:
        return text

    try:

       
        tokenizer.src_lang = source_code

        inputs = tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        )

       
        forced_bos_token_id = (
            tokenizer.convert_tokens_to_ids(
                target_code
            )
        )

        translated_tokens = model.generate(
            **inputs,
            forced_bos_token_id=forced_bos_token_id,
            max_length=512
        )

        translated_text = tokenizer.batch_decode(
            translated_tokens,
            skip_special_tokens=True
        )[0]

        return translated_text.strip()

    except Exception as e:

        raise RuntimeError(
            f"NLLB translation failed: {str(e)}"
        )




def translate_segments(
    segments: list,
    source_language: str,
    target_language: str
) -> list:

    translated_segments = []

    for segment in segments:

        original_text = segment.get(
            "text",
            ""
        ).strip()

        if not original_text:
            continue

        translated_text = translate_text(
            original_text,
            source_language,
            target_language
        )

        translated_segments.append({

            "start":
                segment.get("start", 0),

            "end":
                segment.get("end", 0),

            "original_text":
                original_text,

            "translated_text":
                translated_text
        })

    return translated_segments