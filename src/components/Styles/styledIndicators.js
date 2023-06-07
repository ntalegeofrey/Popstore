import { styled } from "@mui/material/styles";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { Box, Typography } from "@mui/material";

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
          </Typography>
          <HomeIcon sx={{ color: (theme) => theme.palette.primary.main }} />
        </StyledIndicatorWrapper>
      </StyledBoxContainer>
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
