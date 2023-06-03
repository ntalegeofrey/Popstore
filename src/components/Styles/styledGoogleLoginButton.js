import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { ReactComponent as GoogleIcon } from "../../icons/google-icon.svg";

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  border: "2px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.white.main,
  width: "50%",
  height: "15%",
  padding: theme.spacing(1, 2),
  marginTop: "32px",
  marginBottom: "32px",
  "& svg": {
    marginRight: theme.spacing(1),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "6px",
    width: "80%",
  },

  [theme.breakpoints.between("sm", "md")]: {
    fontSize: "16px",
  },
}));

const GoogleButton = ({ onClick }) => {
  return (
    <StyledButton
      startIcon={<GoogleIcon />}
      variant="outlined"
      onClick={onClick}
    >
      Continue with Google
    </StyledButton>
  );
};

export default GoogleButton;
