function ProgressSteps({ currentStep }) {
  const steps = [
    "Upload Video",
    "Extract Audio",
    "Speech Recognition",
    "Translation",
    "Voice Generation",
    "Final Video"
  ];

  return (
    <div className="progress-container">

      {steps.map((step, index) => {

        const stepNumber = index + 1;

        let status = "";

        if (stepNumber < currentStep) {
          status = "completed";
        } else if (stepNumber === currentStep) {
          status = "active";
        }

        return (
          <div
            key={step}
            className={`progress-step ${status}`}
          >

            <div className="progress-circle">
              {stepNumber < currentStep
                ? "✓"
                : stepNumber}
            </div>

            <span>
              {step}
            </span>

          </div>
        );
      })}

    </div>
  );
}

export default ProgressSteps;