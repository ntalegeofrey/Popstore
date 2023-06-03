import React from "react";
import { Modal, IconButton, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import GoogleButton from "./styledGoogleLoginButton";

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
  borderRadius: theme.spacing(1),
  textAlign: "center",
  width: "50%",
  height: "50%",
  borderRadius: 0,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
}));

const StyledLink = styled("a")(({ theme }) => ({
  fontWeight: 400,
  textDecoration: "underline",
  color: theme.palette.text.main,
}));

const PopUpModal = ({ open, onClose, saveSheet }) => {
  return (
    <StyledModal open={open} onClose={onClose}>
      <PopupContainer>
        <Box sx={{ display: "flex", marginLeft: "auto" }}>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Box>
        <Typography variant="h2">Welcome to PopStore!</Typography>
        <Typography variant="body1" mt="10px">
          Login
        </Typography>
        <GoogleButton onClick={saveSheet} />
        <p>
          By continuing, you agree to PopStore’s{" "}
          <StyledLink href="#">Terms & Conditions</StyledLink>.
        </p>
      </PopupContainer>
    </StyledModal>
  );
};

export default PopUpModal;
