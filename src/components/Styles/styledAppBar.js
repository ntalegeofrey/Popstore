import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";

// App bar
export const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background,
  display: "flex",
}));

// Tool Bar
export const StyledToolBar = styled(Toolbar)(({ theme }) => ({
  minHeight: "45px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
  padding: "10px 0px",
  boxSizing: "inherit",
  backgroundColor: theme.palette.white.main,

  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    marginRight: 0,
  },
  [theme.breakpoints.up("md")]: {
    marginLeft: "30px",
    marginRight: "25px",
  },
}));
