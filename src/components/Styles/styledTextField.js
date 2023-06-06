import { styled, TextField } from "@mui/material";

// Styled TextField component
export const StyledTextField = styled(TextField)(({ theme }) => ({
  borderColor: "#353535",
  border: "1px solid",
  borderRadius: "6px",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused": {
    borderColor: "#353535",
  },
}));
