import React from "react";
import ReactJoyride from "react-joyride";

const OnboardingTooltip = ({ steps }) => {
  return (
    <div>
      <ReactJoyride
        continuous={true}
        steps={steps}
        disableCloseOnEsc
        disableOverlayClose
        disableScrollParentFix
        showSkipButton
        disableOverlay
        styles={{
          options: {
            arrowColor: "#4c8991",
            backgroundColor: "#4c8991",
            primaryColor: "#4c8991",
            textColor: "#fff",
            width: "268px",
            zIndex: "162px",
          },
          tooltipContent: {
            padding: "20px 10px",
            textAlign: "left",
            fontWeight: 300,
            fontSize: "16px",
            lineHeight: "22px",
          },
        }}
        locale={{
          last: "Finish",
          skip: "Skip",
          Next: "Next",
        }}
      >
        Test
      </ReactJoyride>
    </div>
  );
};

export default OnboardingTooltip;
