import {
    Box,
    IconButton,
    Toolbar,
    Collapse,
    Grid
} from '@mui/material';
import { StyledDataGrid } from '../../components/Styles/styledDataGrid';
import { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const PopStorePackings = () => {
    const [clickedIndex, setClickedIndex] = useState(-1);

    const onRowExpand = (id) => {
        return clickedIndex === id ? setClickedIndex(-1) : setClickedIndex(id)
    }

    const columns = [
        {
            field: 'referenceId',
            headerName: 'Reference ID',
            width: 150,
            flex: 0.100,
            sortable: false,
            renderCell: params => (
                <Box sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 1.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={12}>
                            <Box sx={{ width: '100%'}}> {params.row.referenceId}</Box>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        <Box sx={{ bgcolor: '#F1F2F4', minHeight: '200px', borderTop: '2px solid #fff' }}>
                            {params.row.referenceId}
                        </Box>
                    </Collapse>
                </Box>
            )
        },
        {
            field: 'product',
            headerName: 'Product',
            flex: 0.100,
            width: 150,
            sortable: false,
            renderCell: params => (
                <Box sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 1.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={12}>
                            <Box sx={{ width: '100%'}}> {params.row.product}</Box>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        <Box sx={{ bgcolor: '#F1F2F4', minHeight: '200px', borderTop: '2px solid #fff' }}>
                            {params.row.product}
                        </Box>
                    </Collapse>
                </Box>
            )
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 0.200,
            width: 300,
            colSpan: 2,
            sortable: false,
            renderCell: params => (
                <Box sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 0.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={6}>
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', height: '40px'}}> {params.row.quantity}</Box>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton  onClick={() => onRowExpand(params.row.id)}>
                                {params.row.id === clickedIndex ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        <Box sx={{ bgcolor: '#F1F2F4', minHeight: '200px', width: '100%', borderTop: '2px solid #fff' }}>
                            {params.row.quantity}
                        </Box>
                    </Collapse>
                </Box>
            )
        },
    ];

    const rows = [
        { id: 1, quantity: '2', price: '20 EUR', product: 'Potatoes', referenceId: '00100235' },
        { id: 2, quantity: '2', price: '5 EUR', product: 'Tomatoes', referenceId: '00100242' },
        { id: 3, quantity: '2', price: '12 EUR', product: 'Bracolli', referenceId: '00100245' },
        { id: 4, quantity: '2', price: '7 EUR', product: 'Avocado', referenceId: '00100216' },
        { id: 5, quantity: '2', price: '30 EUR', product: 'Rice', referenceId: '001002230' },
        { id: 6, quantity: '2', price: '15 EUR', product: 'Bananas', referenceId: '001002150' },
    ];

    console.log(clickedIndex, 'clickedIndex!!')
    return (
        <Box>
            <Toolbar />
            <StyledDataGrid
                clickedIndex={clickedIndex}
                autoHeight
                padded={true}
                rows={rows}
                columns={columns}
                hideFooterPagination
                disableColumnMenu
            />
        </Box>
    )
}

export default PopStorePackings