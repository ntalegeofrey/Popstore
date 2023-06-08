import { styled, TextField } from "@mui/material";

// Styled TextField component
export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid",
    borderColor: "#353535",
    borderRadius: "6px",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused": {
      borderColor: theme.palette.primary.main,
    },
  },
}));
