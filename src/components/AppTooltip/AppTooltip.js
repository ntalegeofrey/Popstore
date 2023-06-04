import { styled } from "@mui/material"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"

const AppTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#4C8991',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
    },
}));

export default AppTooltip