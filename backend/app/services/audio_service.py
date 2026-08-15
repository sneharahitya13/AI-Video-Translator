import os
import subprocess


def extract_audio(video_path, output_folder="outputs"):
    os.makedirs(output_folder, exist_ok=True)

    filename = os.path.splitext(
        os.path.basename(video_path)
    )[0]

    audio_path = os.path.join(
        output_folder,
        f"{filename}.wav"
    )

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

   
    subprocess.run(
        command,
        check=True
    )

    print("Audio extraction completed:", audio_path)

    
    return audio_path


def enhance_audio(audio_path, output_folder="outputs"):
    """
    Enhances the extracted audio by:
    - reducing background noise
    - removing very low/high unwanted frequencies
    - normalizing loudness
    - keeping speech at 16 kHz mono
    """

    os.makedirs(output_folder, exist_ok=True)

    filename = os.path.splitext(
        os.path.basename(audio_path)
    )[0]

    enhanced_audio_path = os.path.join(
        output_folder,
        f"{filename}_enhanced.wav"
    )

    command = [
        "ffmpeg",
        "-y",
        "-i",
        audio_path,

        "-af",
        "highpass=f=80,"
        "lowpass=f=12000,"
        "afftdn=nr=12:nf=-25,"
        "loudnorm=I=-16:TP=-1.5:LRA=11",

        "-ar",
        "16000",
        "-ac",
        "1",

        enhanced_audio_path
    ]

    # Actually run FFmpeg
    subprocess.run(
        command,
        check=True
    )

    print(
        "Audio enhancement completed:",
        enhanced_audio_path
    )

  
    return enhanced_audio_path