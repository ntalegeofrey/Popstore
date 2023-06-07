import { styled } from "@mui/material/styles";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { Box, Typography } from "@mui/material";
import DashboardTooltip from "../DashboardTooltip";
import { useDashboardTooltips } from "../../context/useDashboardTooltips";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  marginTop: "30px",
  padding: "16px",
  border: "2px solid",
  borderColor: "#7a7d81",
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
}));

const StyledIndicatorWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: "16px",
  alignItems: "center",
}));

<<<<<<< HEAD

export const PostoreIndicator = () => {
  const { addTooltipRef } = useDashboardTooltips();
  return (
    <>
      <DashboardTooltip>
        <StyledBoxContainer ref={(el) => addTooltipRef(el, 2)}>
          <Typography variant="h4" color="text.main">
            My PopStores:
=======
export const PostoreIndicator = ({ popstores }) => {
  return (
    <>
      <StyledBoxContainer>
        <Typography variant="h4" color="text.main">
          My PopStores:
        </Typography>
        <StyledIndicatorWrapper>
          <Typography variant="h3" color="primary.main" mr="16px">
            {popstores}
>>>>>>> 57fdba0 (Updated Link Pasting on the landing page)
          </Typography>
          <StyledIndicatorWrapper>
            <Typography variant="h3" color="primary.main" mr="16px">
              0
            </Typography>
            <HomeIcon sx={{ color: (theme) => theme.palette.primary.main }} />
          </StyledIndicatorWrapper>
        </StyledBoxContainer>
      </DashboardTooltip>
    </>
  );
};

export const DataIndicator = ({ dataUsage }) => {
  return (
    <>
      <StyledBoxContainer>
        <Typography variant="h4" color="text.main">
          MB Usage:
        </Typography>
        <StyledIndicatorWrapper>
          <Typography variant="h3" color="primary.main" mr="16px">
            {parseFloat(dataUsage).toFixed(3)}
          </Typography>
          <DataUsageIcon
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
        </StyledIndicatorWrapper>
      </StyledBoxContainer>
    </>
  );
};
