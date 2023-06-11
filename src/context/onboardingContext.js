import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const titles = [
    "Paste the data you copied from a spreadsheet here",
    "Click 'Create PopStore' to convert your data into a PopStore",
    "View analytics about your PopStores",
    "Copy the link of your PopStore to share it with your customers",
    "Click on your PopStore to view & edit your store, orders, customers, and packaging",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const isOnboardingCompleted = () => {
    return completed;
  };

  const markOnboardingCompleted = () => {
    setCompleted(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        titles,
        currentIndex,
        setCurrentIndex,
        isOnboardingCompleted,
        markOnboardingCompleted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => useContext(OnboardingContext);
