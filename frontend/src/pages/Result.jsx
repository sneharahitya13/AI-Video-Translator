import { useState } from "react";

function Result({ result, onTranslateAnother }) {
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [downloading, setDownloading] = useState(false);

  const translatedVideo =
    result?.translated_video ||
    result?.video ||
    result?.translatedVideo;

  const targetLanguage =
    result?.target_language ||
    result?.targetLanguage ||
    "Selected language";

  const emotion = result?.emotion;

  const emotionConfidence =
    result?.emotion_confidence ?? 0;

  const subtitleSegments =
    result?.subtitleSegments || [];

  const handleVideoTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;

    const activeSegment = subtitleSegments.find(
      (segment) =>
        currentTime >= segment.start &&
        currentTime <= segment.end
    );

    if (activeSegment) {
      setCurrentSubtitle(
        activeSegment.translated_text || ""
      );
    } else {
      setCurrentSubtitle("");
    }
  };

  const handleDownload = async () => {
    if (!translatedVideo) {
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(translatedVideo);

      if (!response.ok) {
        throw new Error("Unable to download video.");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = "SpeakLocal-translated-video.mp4";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to download the translated video.");
    } finally {
      setDownloading(false);
    }
  };

  const formattedEmotion =
    emotion
      ? emotion.charAt(0).toUpperCase() + emotion.slice(1)
      : "";

  const confidencePercentage =
    emotionConfidence <= 1
      ? Math.round(emotionConfidence * 100)
      : Math.round(emotionConfidence);

  return (
    <div className="result-page">

      <header className="result-navbar">
        <div className="result-brand">
          SpeakLocal
        </div>
      </header>

      <main className="result-main">

        <section className="result-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="result-eyebrow">
            TRANSLATION COMPLETE
          </p>

          <h1>
            Your video is ready
          </h1>

          <p className="result-description">
            Your video has been translated successfully.
          </p>

          {translatedVideo && (
            <div className="video-container">

              <video
                controls
                playsInline
                src={translatedVideo}
                onTimeUpdate={handleVideoTimeUpdate}
              >
                Your browser does not support video playback.
              </video>

              {currentSubtitle && (
                <div className="video-subtitle">
                  {currentSubtitle}
                </div>
              )}

            </div>
          )}

          {/* Emotion Information */}
          {emotion && (
            <div className="emotion-card">

              <div className="emotion-icon">
                😊
              </div>

              <div className="emotion-content">

                <span className="emotion-label">
                  Voice Emotion Detected
                </span>

                <strong className="emotion-name">
                  {formattedEmotion}
                </strong>

                <span className="emotion-confidence">
                  Confidence: {confidencePercentage}%
                </span>

              </div>

            </div>
          )}

          <div className="result-actions">

            {translatedVideo && (
              <button
                className="download-button"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading
                  ? "Downloading..."
                  : "Download Video"}
              </button>
            )}

            <button
              className="another-video-button"
              onClick={onTranslateAnother}
            >
              Translate Another Video
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Result;