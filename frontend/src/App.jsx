import { useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [video, setVideo] = useState(null);
  const [language, setLanguage] = useState("te");
  const [loading, setLoading] = useState(false);

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [audioFile, setAudioFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [subtitleFile, setSubtitleFile] = useState("");
  const [subtitleSegments, setSubtitleSegments] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [emotion, setEmotion] = useState("");
  const [emotionConfidence, setEmotionConfidence] = useState(0);

  const handleTranslate = async () => {
    if (!video) {
      alert("Please select a video.");
      return;
    }

    const formData = new FormData();

    formData.append("file", video);
    formData.append("language", language);

    try {
      setLoading(true);

      const response = await API.post(
        "/extract-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend response:", response.data);

      // -----------------------------
      // Original transcription
      // -----------------------------

      setOriginalText(
        response.data.transcription.text
      );

      // -----------------------------
      // Translated text
      // -----------------------------

      setTranslatedText(
        response.data.translation
          .map(
            (item) =>
              item.translated_text
          )
          .join(" ")
      );
      setSubtitleSegments(
        response.data.translation
      );


      setAudioFile(
        "http://127.0.0.1:8000/" +
        response.data.translated_audio
      );



      setVideoFile(
        "http://127.0.0.1:8000/" +
        response.data.translated_video
      );



      if (response.data.subtitle_vtt) {
        setSubtitleFile(
          "http://127.0.0.1:8000/" +
          response.data.subtitle_vtt
        );
      }



      if (response.data.emotion) {
        setEmotion(
          response.data.emotion
        );
      }

      if (
        response.data.emotion_confidence !==
        undefined
      ) {
        setEmotionConfidence(
          response.data.emotion_confidence
        );
      }

    } catch (error) {

      console.error(
        "Translation error:",
        error
      );

      if (error.response) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }

      alert(
        "Translation Failed. Check the backend terminal."
      );

    } finally {
      setLoading(false);
    }
  };
  const handleVideoTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;

    const activeSegment = subtitleSegments.find(
     (segment) =>
       currentTime >= segment.start &&
       currentTime <= segment.end
  );

  if (activeSegment) {
    setCurrentSubtitle(
      activeSegment.translated_text
    );
  } else {
    setCurrentSubtitle("");
  }
};

  return (
    <div className="page">

      {/* Background decorative letters */}

      <div className="background">

        {[
          ["A", "5%", "5%", "90", "#BDE0FE"],
          ["B", "10%", "18%", "70", "#FFD6A5"],
          ["C", "7%", "35%", "110", "#C8B6FF"],
          ["D", "15%", "52%", "75", "#A8E6CF"],
          ["E", "6%", "70%", "95", "#FFD1DC"],
          ["F", "10%", "90%", "65", "#FFE29A"],

          ["अ", "22%", "6%", "120", "#FBCFE8"],
          ["आ", "30%", "22%", "80", "#FFD6A5"],
          ["इ", "18%", "40%", "100", "#C4B5FD"],
          ["ई", "28%", "58%", "70", "#A7F3D0"],
          ["उ", "22%", "82%", "90", "#BFDBFE"],

          ["అ", "40%", "8%", "95", "#FFD1DC"],
          ["ఆ", "52%", "20%", "70", "#FDE68A"],
          ["ఇ", "38%", "36%", "110", "#C7D2FE"],
          ["ఈ", "48%", "55%", "80", "#A7F3D0"],
          ["ఉ", "42%", "88%", "100", "#FBCFE8"],

          ["அ", "62%", "5%", "100", "#BDE0FE"],
          ["ஆ", "70%", "25%", "80", "#FFD6A5"],
          ["இ", "58%", "45%", "120", "#C8B6FF"],
          ["உ", "72%", "66%", "70", "#A8E6CF"],

          ["ಅ", "82%", "10%", "90", "#FFD1DC"],
          ["ಆ", "90%", "28%", "75", "#FFE29A"],
          ["ಇ", "84%", "52%", "110", "#BFDBFE"],

          ["അ", "86%", "82%", "95", "#FBCFE8"],

          ["あ", "8%", "58%", "120", "#D8B4FE"],
          ["い", "18%", "74%", "70", "#BDE0FE"],
          ["う", "32%", "92%", "90", "#FFD6A5"],

          ["文", "55%", "78%", "120", "#C8B6FF"],
          ["字", "74%", "92%", "90", "#A7F3D0"],

          ["ع", "45%", "72%", "100", "#FFD1DC"],
          ["ش", "65%", "90%", "75", "#FDE68A"],

          ["한", "92%", "62%", "110", "#BFDBFE"],

          ["A", "35%", "95%", "70", "#FFD6A5"],
          ["B", "50%", "2%", "90", "#BDE0FE"],
          ["C", "76%", "38%", "80", "#FBCFE8"],
          ["D", "95%", "45%", "120", "#C8B6FF"],
          ["E", "88%", "95%", "70", "#A7F3D0"],
          ["F", "58%", "30%", "95", "#FFD1DC"],

          ["अ", "5%", "48%", "65", "#FFE29A"],
          ["అ", "14%", "64%", "120", "#BFDBFE"],
          ["அ", "28%", "12%", "90", "#FFD1DC"],
          ["ಅ", "38%", "82%", "70", "#BDE0FE"],
          ["അ", "52%", "94%", "100", "#FBCFE8"],

          ["あ", "70%", "8%", "110", "#C8B6FF"],
          ["文", "82%", "72%", "75", "#FFD6A5"],
          ["ع", "96%", "18%", "95", "#A7F3D0"],
          ["한", "92%", "35%", "70", "#FDE68A"]

        ].map(
          (
            [letter, top, left, size, color],
            i
          ) => (
            <span
              key={i}
              style={{
                top,
                left,
                fontSize: `${size}px`,
                color,
                transform: `rotate(${
                  Math.random() * 40 - 20
                }deg)`
              }}
            >
              {letter}
            </span>
          )
        )}

      </div>


      {/* Main container */}

      <div className="container">

        <h1>
          AI Multilingual Video Translator
        </h1>


        {/* Video upload */}

        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />

        <br />
        <br />


        {/* Language */}

        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
        >
          <option value="te">
            Telugu
          </option>

          <option value="hi">
            Hindi
          </option>

          <option value="ta">
            Tamil
          </option>

          <option value="kn">
            Kannada
          </option>

          <option value="ml">
            Malayalam
          </option>
        </select>

        <br />
        <br />


        {/* Translate button */}

        <button
          onClick={handleTranslate}
          disabled={loading}
        >
          {loading
            ? "Translating..."
            : "Translate Video"}
        </button>


        <br />
        <br />


        {/* Loading */}

        {loading && (
          <h3>
            Processing... Please Wait...
          </h3>
        )}


        {/* Results */}

        {originalText && (
          <>
            <hr />

            {/* Original text */}

            {/* Emotion */}

            {emotion && (
             <div
              style={{
                margin: "20px 0",
                padding: "15px",
                borderRadius: "10px",
                textAlign: "center",
                backgroundColor: "#f3f4f6"
              }}
            >
              <h2>
                Detected Emotion
              </h2>

              <p>
                 <strong>
                    {emotion}
                 </strong>
              </p>

              <p>
              Confidence:{" "}
              {(emotionConfidence * 100).toFixed(1)}
              %
            </p>
          </div>
)}

            {/* Video + subtitles */}

            {videoFile && (
              <>
                <h2>
                  Translated Video
                </h2>

                <div
  style={{
    position: "relative",
    width: "100%"
  }}
>
  <video
    controls
    width="100%"
    onTimeUpdate={handleVideoTimeUpdate}
  >
    <source
      src={videoFile}
      type="video/mp4"
    />

    Your browser does not support video.
  </video>

  {currentSubtitle && (
    <div
      style={{
        position: "absolute",
        bottom: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "20px",
        textAlign: "center",
        maxWidth: "85%",
        zIndex: 10
      }}
    >
      {currentSubtitle}
    </div>
  )}
</div>
              </>
            )}

          </>
        )}

      </div>

    </div>
  );
}

export default App;