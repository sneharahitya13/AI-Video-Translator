import ProgressSteps from "../components/ProgressSteps";

function Translation({
  currentStep,
  video,
  language
}) {

  const languageNames = {
    te: "Telugu",
    hi: "Hindi",
    ta: "Tamil",
    kn: "Kannada",
    ml: "Malayalam",
    en: "English"
  };

  return (
    <div className="page">

      <div className="container">

        <h1>
          Translating Your Video
        </h1>

        <p>
          Please wait while SpeakLocal
          processes your video.
        </p>

        {video && (
          <p>
            <strong>Video:</strong>{" "}
            {video.name}
          </p>
        )}

        <p>
          <strong>Target Language:</strong>{" "}
          {languageNames[language] || language}
        </p>

        <hr />

        <ProgressSteps
          currentStep={currentStep}
        />

        <br />

        <h2>
          Processing...
        </h2>

        <p>
          Whisper, translation, emotion
          detection, voice generation and
          video processing are running.
        </p>

        <p>
          Please keep this page open.
        </p>

      </div>

    </div>
  );
}

export default Translation;