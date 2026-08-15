import os


def format_timestamp(seconds):
    milliseconds = int(
        (seconds - int(seconds)) * 1000
    )

    total_seconds = int(seconds)

    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    return (
        f"{hours:02d}:"
        f"{minutes:02d}:"
        f"{seconds:02d},"
        f"{milliseconds:03d}"
    )


def format_vtt_timestamp(seconds):
    milliseconds = int(
        (seconds - int(seconds)) * 1000
    )

    total_seconds = int(seconds)

    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    return (
        f"{hours:02d}:"
        f"{minutes:02d}:"
        f"{seconds:02d}."
        f"{milliseconds:03d}"
    )


def generate_srt(
    segments,
    output_folder="outputs",
    filename="translated_subtitles.srt"
):

    os.makedirs(
        output_folder,
        exist_ok=True
    )

    subtitle_path = os.path.join(
        output_folder,
        filename
    )

    with open(
        subtitle_path,
        "w",
        encoding="utf-8"
    ) as file:

        for index, segment in enumerate(
            segments,
            start=1
        ):

            start = segment["start"]
            end = segment["end"]

            text = segment.get(
                "translated_text",
                segment.get("text", "")
            )

            file.write(
                f"{index}\n"
            )

            file.write(
                f"{format_timestamp(start)} --> "
                f"{format_timestamp(end)}\n"
            )

            file.write(
                f"{text.strip()}\n\n"
            )

    return subtitle_path


def generate_vtt(
    segments,
    output_folder="outputs",
    filename="translated_subtitles.vtt"
):

    os.makedirs(
        output_folder,
        exist_ok=True
    )

    subtitle_path = os.path.join(
        output_folder,
        filename
    )

    with open(
        subtitle_path,
        "w",
        encoding="utf-8"
    ) as file:

        file.write("WEBVTT\n\n")

        for index, segment in enumerate(
            segments,
            start=1
        ):

            start = segment["start"]
            end = segment["end"]

            text = segment.get(
                "translated_text",
                segment.get("text", "")
            )

            file.write(
                f"{index}\n"
            )

            file.write(
                f"{format_vtt_timestamp(start)} --> "
                f"{format_vtt_timestamp(end)}\n"
            )

            file.write(
                f"{text.strip()}\n\n"
            )

    return subtitle_path