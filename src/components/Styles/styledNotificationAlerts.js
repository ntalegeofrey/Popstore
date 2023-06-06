import React from "react";
import { Modal, IconButton, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const PopupContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F2F4F5",
  padding: theme.spacing(3),
  textAlign: "center",
  width: "90%",
  [theme.breakpoints.up("sm")]: {
    width: "50%",
  },
  borderRadius: 0,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  alignSelf: "flex-end",
}));

const OkButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: "25%",
  marginBottom: "15px",
  "&.MuiButton-contained": {
    color: theme.palette.white.main,
  },
}));

export const SuccessAlert = ({ open, onClose, message, navigate }) => {
  return (
    <>
      <StyledModal open={open} onClose={onClose}>
        <PopupContainer>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
          <Typography
            variant="h3"
            sx={{ marginBottom: (theme) => theme.spacing(2) }}
          >
            {message}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: (theme) => theme.spacing(2),
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                color: (theme) => theme.palette.primary.main,
                height: "50px",
                width: "50px",
                marginRight: (theme) => theme.spacing(2),
              }}
              fontSize="large"
            />
          </Box>
          <OkButton variant="contained" onClick={navigate}>
            OK
          </OkButton>
        </PopupContainer>
      </StyledModal>
    </>
  );
};

export const ErrorAlert = ({ open, onClose, message }) => {
  return (
    <StyledModal open={open} onClose={onClose}>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <Typography
          variant="h3"
          sx={{ marginBottom: (theme) => theme.spacing(2) }}
        >
          {message}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: (theme) => theme.spacing(2),
          }}
        >
          <ErrorOutlineIcon
            sx={{
              color: (theme) => theme.palette.error.main,
              height: "50px",
              width: "50px",
              marginRight: (theme) => theme.spacing(2),
            }}
            fontSize="large"
          />
        </Box>
        <OkButton variant="contained" onClick={onClose}>
          OK
        </OkButton>
      </PopupContainer>
    </StyledModal>
  );
};
