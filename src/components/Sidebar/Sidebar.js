import { useState } from 'react'
import { Box } from "@mui/material";
import SidebarList from './SidebarList';
import { StyledDrawer } from '../Styles/styledDrawer';

const drawerWidth = 240;

const Sidebar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const container = window !== undefined ? () => window().document.body : undefined;
    const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };

    return (
        <Box
            component="nav"
            sx={(theme) => ({
                bgcolor: theme.palette.white.main,
                width: { sm: drawerWidth }, flexShrink: { sm: 0 }
            })}
            aria-label="mailbox folders"
        >
            <StyledDrawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                <SidebarList />
            </StyledDrawer>
            <StyledDrawer
                variant="permanent"
                drawerWidth={drawerWidth}
                open
            >
                <SidebarList />
            </StyledDrawer>
        </Box>
    )
}

export default Sidebar;