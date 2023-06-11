import React from "react";
import ReactJoyride from "react-joyride";

const OnboardingTooltip = ({ steps }) => {
  return (
    <div>
      <ReactJoyride
        continuous={true}
        steps={steps}
        styles={{
          options: {
            arrowColor: "#4c8991",
            backgroundColor: "#4c8991",
            primaryColor: "#4c8991",
            textColor: "#fff",
            width: "268px",
            zIndex: "162px",
          },
        }}
      >
        Test
      </ReactJoyride>
    </div>
  );
};

export default OnboardingTooltip;
