import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import colors from "./colors";
import typography from "./typography";
import { Box, CssBaseline } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";

const ThemeCustomization = ({ children }) => {
  const lightTheme = createTheme({
    palette: { ...colors },
    typography: { ...typography },
    direction: "ltr",
    mixins: {
      toolbar: {
        minHeight: 60,
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return (
    <ThemeProvider theme={responsiveFontSizes(lightTheme)}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "row",
          overflowY: "scroll",
        }}
      >
        <CssBaseline />
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default ThemeCustomization;
