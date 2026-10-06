# backend/app/services/transcription_service.py

import whisper


print("Loading Whisper model...")

model = whisper.load_model("base")

print("Whisper model loaded successfully.")


def transcribe_audio(audio_path: str) -> dict:

    try:

        result = model.transcribe(
            audio_path,
            task="transcribe"
        )

        segments = []

        for segment in result.get(
            "segments",
            []
        ):

            text = segment.get(
                "text",
                ""
            ).strip()

            if text:

                segments.append({

                    "start":
                        segment.get(
                            "start",
                            0
                        ),

                    "end":
                        segment.get(
                            "end",
                            0
                        ),

                    "text":
                        text
                })

        return {

            "text":
                result.get(
                    "text",
                    ""
                ).strip(),

            "language":
                result.get(
                    "language",
                    "unknown"
                ),

            "segments":
                segments
        }

    except Exception as e:

        raise RuntimeError(
            f"Transcription failed: {str(e)}"
        )