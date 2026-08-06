import os
import subprocess
import uuid


OUTPUT_FOLDER = "outputs"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)



def merge_audio_video(video_path, audio_path):

    output_video = os.path.join(
        OUTPUT_FOLDER,
        f"translated_video_{uuid.uuid4()}.mp4"
    )


    command = [

        "ffmpeg",

        "-i",
        video_path,

        "-i",
        audio_path,

        "-c:v",
        "copy",

        "-map",
        "0:v:0",

        "-map",
        "1:a:0",

        "-shortest",

        output_video

    ]


    subprocess.run(
        command,
        check=True
    )


    return output_video