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
import { useNavigate } from 'react-router-dom';

const SidebarList = () => {
    const navigate = useNavigate();
    return (
        <Box component='div'>
            <Toolbar />
            <List>
                <ListItemButton sx={{ px: '0px !important' }}>
                    <ListItemIcon>
                        <ChevronLeftIcon />
                    </ListItemIcon>
                    <ListItemText primary="Fresh Vegetables" />
                </ListItemButton>
                {sidebarRoutes.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton sx={{ px: '0px !important' }} onClick={() => navigate(item.path)}>
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