import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

// Logo
export const StyledLogo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));
