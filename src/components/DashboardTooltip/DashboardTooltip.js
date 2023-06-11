import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useOnboardingContext } from "../../context/onboardingContext";
import AppTooltip from "../AppTooltip/AppTooltip";

const DashboardTooltip = ({ messageIndex, children }) => {
  const { titles, setCurrentIndex, isOnboardingCompleted } =
    useOnboardingContext();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentIndex(0); // Reset the index when closing the tooltip
  };

  const handleNext = () => {
    if (messageIndex < titles.length - 1) {
      setCurrentIndex(messageIndex + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
    isOnboardingCompleted(); // Mark onboarding as completed
  };

  const handleBack = () => {
    if (messageIndex > 0) {
      setCurrentIndex(messageIndex - 1);
    }
  };

  useEffect(() => {
    if (!isOnboardingCompleted() && messageIndex === 0) {
      setOpen(true);
    }
  }, [messageIndex]);

  return (
    <AppTooltip
      open={open}
      title={
        <div>
          <div>{titles[messageIndex]}</div>
          <div>{`${messageIndex + 1} / ${titles.length}`}</div>
          <button onClick={handleBack} disabled={messageIndex === 0}>
            Back
          </button>
          <button onClick={handleSkip}>Skip</button>
          <button onClick={handleNext}>
            {messageIndex === titles.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      }
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <div onClick={handleNext} onKeyDown={handleNext} tabIndex={0}>
        {children}
      </div>
    </AppTooltip>
  );
};

DashboardTooltip.propTypes = {
  messageIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default DashboardTooltip;
