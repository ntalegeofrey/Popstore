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
}));

export default AppTooltip;
