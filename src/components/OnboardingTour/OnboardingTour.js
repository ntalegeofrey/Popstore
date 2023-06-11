import React, { useState } from "react";
import AppTooltip from "./AppTooltip";

const OnboardingTour = ({ titles }) => {
  const [step, setStep] = useState(0); // Current step of the tour

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    setStep(titles.length); // Set step to the last step to end the tour
  };

  const renderTooltip = () => {
    const currentTitle = titles[step];
    const showBackButton = step > 0;
    const showNextButton = step < titles.length - 1;
    const showSkipButton = step === titles.length - 1;

    return (
      <div>
        <AppTooltip
          title={currentTitle}
          placement="top"
          open
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <div>
            {showBackButton && <button onClick={handleBack}>Back</button>}
            {showNextButton && <button onClick={handleNext}>Next</button>}
            {showSkipButton && <button onClick={handleSkip}>Skip</button>}
          </div>
        </AppTooltip>
      </div>
    );
  };

  return renderTooltip();
};

export default OnboardingTour;
