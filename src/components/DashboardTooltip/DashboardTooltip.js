import AppTooltip from "../AppTooltip";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const DashboardTooltipComponent = ({ handleClose }) => {
  const titles = [
    "Paste the data you copied from a spreedsheet here",
    "Click “Create PopStore” to convert your data into a PopStore",
    "View analytics about your PopStores",
    "Copy the link of your PopStore to share it your customers",
    "Click on your PopStore to view & edit your store, order, customers and packing"
  ];
  const [activeTitle, setActiveTitle] = useState({
    index: 0,
    title: titles[0],
  });

  const handleNext = () => {
    setActiveTitle((prevTitle) => {
      const nextIdex = prevTitle.index + 1;
      return nextIdex >= titles.length
        ? { ...prevTitle }
        : {
            index: nextIdex,
            title: titles[nextIdex],
          };
    });
  };

  const handleBack = () => {
    setActiveTitle((prevTitle) => {
      const prevIndex = prevTitle.index - 1;
      return prevIndex <= 0
        ? { ...prevTitle }
        : {
            index: prevIndex,
            title: titles[prevIndex],
          };
    });
  };

  return (
    <div style={{ padding: ".2em" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          component="button"
          variant="body2"
          sx={{ color: "#fff;", px: "0px !important;" }}
          underline="none"
          onClick={handleBack}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArrowBackIosNewIcon fontSize="small" sx={{ fontSize: "8px", marginRight: "2px" }} />
            <div>Back</div>
          </Box>
        </Link>
        <Link
          component="button"
          variant="body2"
          sx={{ color: "#fff;", px: "0px !important;" }}
          underline="none"
          onClick={handleClose}
        >
          Skip
        </Link>
      </Box>
      <Box sx={{ py: ".5rem" }}>
        {activeTitle.title}
        <span style={{ paddingLeft: "4px" }}>{`(${activeTitle.index + 1}/${
          titles.length
        })`}</span>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link
          component="button"
          variant="body2"
          sx={{ color: "#fff;", px: "0px !important;" }}
          underline="none"
          onClick={handleNext}
        >
          {activeTitle.index + 1 === titles.length ? (
            "End"
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <div>Next</div>
              <NavigateNextIcon fontSize="small" sx={{ fontSize: "14px" }} />
            </Box>
          )}
        </Link>
      </Box>
    </div>
  );
};

const DashboardTooltip = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <AppTooltip
      open={open}
      title={
        <React.Fragment>
          <DashboardTooltipComponent handleClose={() => setOpen(false)} />
        </React.Fragment>
      }
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      {children}
    </AppTooltip>
  );
};

export default DashboardTooltip;
