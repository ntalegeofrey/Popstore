import React from "react";
import { Modal, IconButton, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { DeleteOutline, DownloadOutlined } from "@mui/icons-material";
import toast from "react-hot-toast";

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

const PopupContainer2 = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: "#F2F4F5",
  padding: theme.spacing(3),
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

export const DeleteAlert = ({
  open,
  onClose,
  message,
  deleteClicked,
  cancelClicked,
  downloadClicked,
}) => {
  // Custom toast style
  const customToastStyle = {
    background: "#4c8991",
    color: "white",
  };

  // Show custom toast
  const showCustomToast = () => {
    toast("Pdf download in progress", {
      style: customToastStyle,
    });
  };
  return (
    <StyledModal open={open} onClose={onClose}>
      <PopupContainer2>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <div
          style={{
            marginLeft: "75px",
            marginRight: "75px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h3"
              sx={{ marginBottom: (theme) => theme.spacing(2) }}
            >
              {message}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              marginBottom: (theme) => theme.spacing(2),
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
              alignItems: "center",
              marginTop: "21px",
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              You can save your data before deleting.{" "}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: (theme) => theme.palette.majorBlack,
                border: "1px solid #353535",
              }}
              startIcon={<DownloadOutlined />}
              onClick={() => {
                showCustomToast("Pdf download in progress");
                downloadClicked();
              }}
            >
              Download data
            </Button>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: (theme) => theme.spacing(2),
                width: "100%",
                justifyContent: "center",
              }}
              onClick={deleteClicked}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",

                  width: "209px",
                  height: "40px",
                  marginTop: "51px",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
                startIcon={<DeleteOutline />}
              >
                Delete
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: (theme) => theme.spacing(2),
                width: "100%",
              }}
              onClick={cancelClicked}
            >
              <Button
                variant="text"
                sx={{
                  color: (theme) => theme.palette.majorBlack,
                  textDecoration: "underline",
                  marginTop: "16px",
                  marginBottom: "21px",
                }}
              >
                <u>cancel</u>
              </Button>
            </Box>
          </div>
        </div>
      </PopupContainer2>
    </StyledModal>
  );
};
