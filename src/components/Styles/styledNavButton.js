import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

// Styled Button.
export const StyledNavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  padding: "8px 16px",
  ...(active && {
    color: theme.palette.primary.main,
  }),
  ...(!active && {
    color: theme.palette.text.main,
  }),
}));
