import {
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const SidebarList = () => {
    return (
        <Box component='div'>
            <Toolbar />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <ChevronLeftIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default SidebarList;