import { styled } from "@mui/material/styles";
import React from "react";
import { Box, Typography } from "@mui/material";
import HomeIcon from "../../icons/HomeIcon";
import MBIcon from "../../icons/MBIcon";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  marginTop: "30px",
  padding: "16px",
  border: "1px solid",
  borderColor: "#000000",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  width: "166px",
  height: "86px",
}));

const StyledIndicatorWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: "16px",
  alignItems: "center",
  width: "20px",
  height: "20px",
  width: "100%",
}));

export const PostoreIndicator = ({ popstores }) => {
  return (
    <>
      <StyledBoxContainer id="step3">
        <Typography variant="body3" color="majorBlack">
          My PopStores:
        </Typography>
        <StyledIndicatorWrapper>
          <Typography
            id="step3"
            variant="h3"
            color="primary.main"
            mr="16px"
            sx={{ fontWeight: 400, fontSize: "40px", lineHeight: "54.47px" }}
          >
            {popstores}
          </Typography>
          <HomeIcon />
        </StyledIndicatorWrapper>
      </StyledBoxContainer>
    </>
  );
};

export const DataIndicator = ({ dataUsage }) => {
  return (
    <>
      <StyledBoxContainer>
        <Typography variant="body3" color="majorBlack">
          MB Usage:
        </Typography>
        <StyledIndicatorWrapper>
          <Typography
            variant="h3"
            color="primary.main"
            mr="16px"
            sx={{ fontWeight: 400, fontSize: "40px", lineHeight: "54.47px" }}
          >
            {parseFloat(dataUsage).toFixed(3)}
          </Typography>
          <MBIcon />
        </StyledIndicatorWrapper>
      </StyledBoxContainer>
    </>
  );
};
