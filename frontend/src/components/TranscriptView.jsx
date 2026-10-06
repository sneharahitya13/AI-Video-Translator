function TranscriptView({ segments }) {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <div className="transcript-container">

      <h2>Sentence Translation</h2>

      {segments.map((segment, index) => (

        <div
          className="transcript-card"
          key={index}
        >

          <div className="timestamp">
            {segment.start.toFixed(1)}s
            {" - "}
            {segment.end.toFixed(1)}s
          </div>

          <div className="translation-row">

            <div className="original-column">
              <h4>Original</h4>

              <p>
                {segment.original_text}
              </p>
            </div>

            <div className="translated-column">
              <h4>Translation</h4>

              <p>
                {segment.translated_text}
              </p>
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default TranscriptView;