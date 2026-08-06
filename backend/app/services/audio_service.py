import os
import subprocess


def extract_audio(video_path, output_folder="outputs"):
    os.makedirs(output_folder, exist_ok=True)

    filename = os.path.splitext(os.path.basename(video_path))[0]

    audio_path = os.path.join(output_folder, f"{filename}.wav")

    command = [
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        audio_path
    ]

    subprocess.run(command, check=True)

    return audio_path 