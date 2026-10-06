import { useState } from "react";

function Home({ onTranslate, onLogout }) {
  const [video, setVideo] = useState(null);
  const [language, setLanguage] = useState("Telugu");
  const [translating, setTranslating] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!video) {
      alert("Please select a video.");
      return;
    }

    setTranslating(true);

    try {
      await onTranslate(video, language);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslating(false);
    }
  };

  if (translating) {
    return (
      <div className="translation-loading-page">
        <div className="translation-loading-card">

          <div className="loading-spinner"></div>

          <h1>Translating your video...</h1>

          <p>
            Your video is being translated into{" "}
            <strong>{language}</strong>.
          </p>

          <span>
            This may take a few moments. Please don't close this page.
          </span>

        </div>
      </div>
    );
  }

  return (
    <div className="home-page">

      <header className="home-navbar">
        <div className="home-brand">
          SpeakLocal
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="home-main">

        <section className="home-content">

          <p className="home-eyebrow">
            AI VIDEO TRANSLATION
          </p>

          <h1>
            Translate your video
          </h1>

          <p className="home-description">
            Upload your video and translate it into your preferred
            regional language with AI-powered speech and subtitles generation.
          </p>

          <form
            className="translation-form"
            onSubmit={handleSubmit}
          >

            <div className="upload-box">

              <div className="upload-icon">
                ↑
              </div>

              <h3>
                {video
                  ? video.name
                  : "Upload your video"}
              </h3>

              <p>
                {video
                  ? "Video selected successfully"
                  : "Select a video from your device"}
              </p>

              <label className="choose-video-button">

                {video
                  ? "Choose another video"
                  : "Choose video"}

                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0];

                    if (selectedFile) {
                      setVideo(selectedFile);
                    }
                  }}
                  hidden
                />

              </label>

            </div>

            <div className="language-section">

              <label htmlFor="language">
                Target language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
              >
                <option value="English">
                  English
                </option>

                <option value="Telugu">
                  Telugu
                </option>

                <option value="Tamil">
                  Tamil
                </option>

                <option value="Kannada">
                  Kannada
                </option>

                <option value="Malayalam">
                  Malayalam
                </option>

                <option value="Hindi">
                  Hindi
                </option>
              </select>

            </div>

            <button
            className="translate-button"
            type="button"
            disabled={!video || translating}
            onClick={handleSubmit}
            >
            {translating ? "Translating..." : "Translate Video"}
            </button>
            
              

          </form>

        </section>

      </main>

    </div>
  );
}

export default Home;