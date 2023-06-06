import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const CreatePopstoreBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginLeft: "70px",
    marginRight: "120px",
  },
}));
