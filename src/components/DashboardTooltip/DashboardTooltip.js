import AppTooltip from "../AppTooltip";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDashboardTooltips } from "../../context/useDashboardTooltips";

const DashboardTooltipComponent = ({ handleClose, activeIndex }) => {
  const titles = [
    "Paste the data you copied from a spreedsheet here",
    "Click “Create PopStore” to convert your data into a PopStore",
    "View analytics about your PopStores",
    "Copy the link of your PopStore to share it your customers",
    "Click on your PopStore to view & edit your store, order, customers and packing",
  ];

  const event = new MouseEvent("mouseover", {
    view: window,
    bubbles: true,
    // cancelable: true
  });

  const { refs } = useDashboardTooltips();

  const [activeTitle, setActiveTitle] = useState({
    index: activeIndex,
    title: titles[activeIndex],
  });

  const handleNext = () => {
    setActiveTitle((prevTitle) => {
      const nextIndex = prevTitle.index + 1;
      const newIndex = nextIndex >= titles.length ? prevTitle.index : nextIndex;
      // refs.current[prevTitle.index].blur();
      refs.current[newIndex]?.focus();
      refs.current[newIndex]?.dispatchEvent(event);
      return {
        index: newIndex,
        title: titles[newIndex],
      };
    });
  };

  useEffect(()=>{
    console.log({refs})
  },[])

  const handleBack = () => {
    setActiveTitle((prevTitle) => {
      const prevIndex = prevTitle.index - 1;
      const newIndex = prevIndex <= 0 ? prevTitle.index : prevIndex;
      // console.log("previoudIndex", newIndex, prevIndex)
      // refs.current[prevTitle.index].blur();
      refs.current[newIndex - 1]?.focus();
      refs.current[newIndex -1]?.dispatchEvent(event);
      return {
        index: newIndex,
        title: titles[newIndex],
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
            <ArrowBackIosNewIcon
              fontSize="small"
              sx={{ fontSize: "8px", marginRight: "2px" }}
            />
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
  const { refs } = useDashboardTooltips();
  const [open, setOpen] = useState(false);
  const [currentIdex, setCurrentIdex] = useState(0);
  const handleOpen = (event) => {
    const _currentIdex = refs.current.findIndex((ref) => ref === event.target);
    setCurrentIdex((_) => {
      setOpen(true);
      return _currentIdex;
    });

    // console.log("currentID", currentIdex, event.target);
  };

  useEffect(()=>{
    // console.log("currentIdex", currentIdex)
  },[currentIdex])

  const handleClose = (e) => setOpen(false);
  return (
    <AppTooltip
      open={open}
      title={
        <React.Fragment>
          <DashboardTooltipComponent
            handleClose={() => handleClose()}
            activeIndex={currentIdex}
          />
        </React.Fragment>
      }
      onOpen={(e) => handleOpen(e)}
      onClose={(e) => handleClose(e)}
    >
      {children}
    </AppTooltip>
  );
};

export default DashboardTooltip;
