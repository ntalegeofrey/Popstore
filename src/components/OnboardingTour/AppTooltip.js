import { styled } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const AppTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#4C8991",
    maxWidth: 280,
    fontSize: theme.typography.pxToRem(12),
    padding: ".8rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#4C8991",
    "&::before": {
      backgroundColor: "#4C8991",
    },
  },
  "& button": {
    backgroundColor: "#4C8991",
    color: "#FFF",
    padding: ".5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "1rem",
    fontSize: theme.typography.pxToRem(12),
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#38847D",
    },
  },
}));

export default AppTooltip;
