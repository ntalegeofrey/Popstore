import { DataGrid } from '@mui/x-data-grid';
import { Typography, styled } from "@mui/material";

export const StyledDataGrid = styled(DataGrid)(({ theme, padded }) => ({
    '.MuiDataGrid-columnSeparator': {
        display: 'none',
    },
    '&.MuiDataGrid-root': {
        border: 'none',
    },
    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
        outline: "none !important",
    },
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: '#4C8991',
        color: theme.palette.white.main,
        fontSize: '14px',
        borderBottom: padded ? '8px solid #fff' : 'none',
    },
    "& .MuiDataGrid-row": {
        backgroundColor: 'rgba(76, 137, 145, 0.1)',
        cursor: 'pointer',
        fontSize: '14px',
    },
    "& .MuiDataGrid-virtualScroller": {
        overflow: padded ? 'auto' : 'hidden'
    },
    "& .MuiDataGrid-cell": {
        borderBottom: padded ? `5px solid ${theme.palette.white.main}` : '1px solid #4C8991',
    },
}));

export const StyledDataGridFooterTypography = styled(Typography)(({ text }) => ({
    flex: 1,
    fontSize: '20px',
    fontWeight: '400',
    color: '#353535',
    textAlign: text ? 'end' : '',
    padding: text ? '0 30px' : ''
}));