import {
    Toolbar,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Box,
    ListItemIcon
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { sidebarRoutes } from './SidebarRoutes';

const SidebarList = () => {
    return (
        <Box component='div'>
            <Toolbar />
            <List>
                <ListItemButton>
                    <ListItemIcon>
                        <ChevronLeftIcon />
                    </ListItemIcon>
                    <ListItemText primary="Fresh Vegetables" />
                </ListItemButton>
                {sidebarRoutes.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon />
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box >
    )
}

export default SidebarList;