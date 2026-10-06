import { useEffect, useState } from "react";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Result from "./pages/Result";

import API from "./api";
import { supabase } from "./supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [page, setPage] = useState("signin");

  const [videoFile, setVideoFile] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [subtitleFile, setSubtitleFile] = useState("");

  const [subtitleSegments, setSubtitleSegments] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  const [emotion, setEmotion] = useState("");
  const [emotionConfidence, setEmotionConfidence] = useState(0);

  // ==========================================
  // CHECK SUPABASE SESSION
  // ==========================================

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setAuthLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // HANDLE AUTHENTICATION STATE
  // ==========================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (session) {
      if (page === "signin" || page === "signup") {
        setPage("home");
      }
    } else {
      setPage("signin");
    }
  }, [session, authLoading, page]);

  // ==========================================
  // TRANSLATE VIDEO
  // ==========================================

  const handleTranslate = async (
    selectedVideo,
    selectedLanguage
  ) => {
    if (!selectedVideo) {
      alert("Please select a video.");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedVideo);
    formData.append("language", selectedLanguage);

    console.log("Sending video to backend...");
    console.log("Target language:", selectedLanguage);

    try {
      const response = await API.post(
        "/extract-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Backend response:",
        response.data
      );

      // ==========================================
      // TRANSLATED AUDIO
      // ==========================================

      if (response.data.translated_audio) {
        setAudioFile(
          "http://127.0.0.1:8000/" +
            response.data.translated_audio
        );
      } else {
        setAudioFile("");
      }

      // ==========================================
      // TRANSLATED VIDEO
      // ==========================================

      if (response.data.translated_video) {
        setVideoFile(
          "http://127.0.0.1:8000/" +
            response.data.translated_video
        );
      } else if (response.data.video) {
        setVideoFile(
          "http://127.0.0.1:8000/" +
            response.data.video
        );
      } else {
        setVideoFile("");
      }

      // ==========================================
      // SUBTITLE FILE
      // ==========================================

      if (response.data.subtitle_vtt) {
        setSubtitleFile(
          "http://127.0.0.1:8000/" +
            response.data.subtitle_vtt
        );
      } else {
        setSubtitleFile("");
      }

      // ==========================================
      // TRANSLATION SEGMENTS
      // ==========================================

      const translationSegments =
        response.data.translation || [];

      setSubtitleSegments(
        translationSegments
      );

      // ==========================================
      // EMOTION
      // ==========================================

      if (response.data.emotion) {
        setEmotion(
          response.data.emotion
        );
      } else {
        setEmotion("");
      }

      if (
        response.data.emotion_confidence !==
        undefined
      ) {
        setEmotionConfidence(
          response.data.emotion_confidence
        );
      } else {
        setEmotionConfidence(0);
      }

      // ==========================================
      // GO TO RESULT PAGE
      // ==========================================

      setPage("result");

    } catch (error) {
      console.error(
        "Translation error:",
        error
      );

      let errorMessage =
        "Translation failed. Please try again.";

      // ==========================================
      // BACKEND RETURNED AN ERROR
      // ==========================================

      if (error.response) {
        const status =
          error.response.status;

        const data =
          error.response.data;

        console.error(
          "Backend status:",
          status
        );

        console.error(
          "Backend error:",
          data
        );

        const backendMessage =
          data?.detail ||
          data?.message ||
          "";

        const message =
          String(
            backendMessage
          ).toLowerCase();

        // ========================================
        // VIDEO TOO LARGE
        // ========================================

        if (
          status === 413 ||
          message.includes("too large") ||
          message.includes("file size") ||
          message.includes("maximum")
        ) {
          errorMessage =
            "Video is too large. Please upload a smaller video.";
        }

        // ========================================
        // UNSUPPORTED VIDEO FORMAT
        // ========================================

        else if (
          message.includes("unsupported") ||
          message.includes("format") ||
          message.includes("extension")
        ) {
          errorMessage =
            "Unsupported video format. Please upload a supported video file.";
        }

        // ========================================
        // NO SPEECH DETECTED
        // ========================================

        else if (
          message.includes("no speech") ||
          message.includes(
            "speech not detected"
          ) ||
          message.includes(
            "could not detect speech"
          )
        ) {
          errorMessage =
            "No speech was detected in this video. Please upload a video with clear speech.";
        }

        // ========================================
        // TRANSLATION SERVICE FAILURE
        // ========================================

        else if (
          message.includes("translation") ||
          message.includes("nllb") ||
          message.includes("translator")
        ) {
          errorMessage =
            "Translation service failed. Please try again.";
        }

        // ========================================
        // OTHER SERVER ERRORS
        // ========================================

        else if (status >= 500) {
          errorMessage =
            "The translation server encountered an error. Please try again.";
        }

        // ========================================
        // BAD REQUEST
        // ========================================

        else if (status === 400) {
          errorMessage =
            backendMessage ||
            "Invalid video or translation request.";
        }
      }

      // ==========================================
      // BACKEND DID NOT RESPOND
      // ==========================================

      else if (error.request) {
        console.error(
          "No response received from backend:",
          error.request
        );

        errorMessage =
          "Backend unavailable. Please make sure the translation server is running.";
      }

      // ==========================================
      // REQUEST SETUP ERROR
      // ==========================================

      else {
        console.error(
          "Request error:",
          error.message
        );

        errorMessage =
          "Something went wrong while starting the translation.";
      }

      // ==========================================
      // SHOW ERROR TO USER
      // ==========================================

      alert(errorMessage);

      // Re-throw so Home.jsx can stop
      // its translation loading screen.
      throw error;
    }
  };

  // ==========================================
  // VIDEO SUBTITLE TIME UPDATE
  // ==========================================

  const handleVideoTimeUpdate = (event) => {
    const currentTime =
      event.target.currentTime;

    const activeSegment =
      subtitleSegments.find(
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

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );
      return;
    }

    setVideoFile("");
    setAudioFile("");
    setSubtitleFile("");
    setSubtitleSegments([]);
    setCurrentSubtitle("");
    setEmotion("");
    setEmotionConfidence(0);

    setPage("signin");
  };

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div>
        <h2>Loading SpeakLocal...</h2>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!session) {
    if (page === "signup") {
      return (
        <SignUp
          onSignIn={() =>
            setPage("signin")
          }
        />
      );
    }

    return (
      <SignIn
        onSignUp={() =>
          setPage("signup")
        }
      />
    );
  }

  // ==========================================
  // HOME PAGE
  // ==========================================

  if (page === "home") {
    return (
      <Home
        onTranslate={handleTranslate}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // RESULT PAGE
  // ==========================================

  if (page === "result") {
    return (
      <Result
        result={{
          translated_video: videoFile,
          translated_audio: audioFile,
          subtitle_vtt: subtitleFile,
          subtitleSegments: subtitleSegments,
          emotion: emotion,
          emotion_confidence: emotionConfidence,
        }}
        onTranslateAnother={() => {
          setVideoFile("");
          setAudioFile("");
          setSubtitleFile("");
          setSubtitleSegments([]);
          setCurrentSubtitle("");
          setEmotion("");
          setEmotionConfidence(0);
          setPage("home");
        }}
      />
    );
  }

  return null;
}

export default App; 