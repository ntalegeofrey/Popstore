import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Styled main container
export const MainContainer = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(3),
  minHeight: "100vh",
  width: "100%",
  backgroundColor: theme.palette.background,
}));

export default MainContainer;
