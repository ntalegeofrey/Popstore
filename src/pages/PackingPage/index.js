import {
    Box,
    IconButton,
    Toolbar,
    Collapse,
    Grid,
    Typography
} from '@mui/material';
import { StyledDataGrid } from '../../components/Styles/styledDataGrid';
import React, { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SidebarList from '../../components/Sidebar/SidebarList';

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
                <Box
                    px={clickedIndex > 0 && params.row.id !== clickedIndex ? '10px' : 0}
                    sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 1.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={12}>
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                sx={{ width: '100%' }}> {params.row.referenceId}</Box>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        {[1, 2, 3].map((item, index) => (
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                py={1}
                                sx={{
                                    bgcolor: '#F1F2F4',
                                    height: '120px',
                                    borderTop: index === 0 ? '2px solid #fff' : 'none',
                                    borderBottom: '1px solid #353535'
                                }}>
                                {params.row?.details?.user?.email} <br />
                                {params.row?.details?.user?.name} <br />
                                {params.row?.details?.user?.phone}
                            </Box>))}
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
                <Box
                    px={clickedIndex > 0 && params.row.id !== clickedIndex ? '10px' : 0}
                    sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 1.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={12}>
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                sx={{ width: '100%' }}> {params.row.product}</Box>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        {[1, 2, 3].map((item, index) => (
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                sx={{
                                    bgcolor: '#F1F2F4',
                                    height: '120px',
                                    borderTop: index === 0 ? '2px solid #fff' : 'none',
                                    borderBottom: '1px solid #353535'
                                }}>
                            </Box>))}
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
                <Box
                    px={clickedIndex > 0 && params.row.id !== clickedIndex ? '10px' : 0}
                    sx={{ width: '100%' }}>
                    <Grid
                        py={clickedIndex > 0 && params.row.id === clickedIndex ? 0.5 : 0}
                        sx={{
                            bgcolor: clickedIndex > 0 && params.row.id === clickedIndex ? 'rgba(76, 137, 145, 0.1)' : ''
                        }} container xs={12}>
                        <Grid item xs={6}>
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                sx={{ width: '100%', display: 'flex', alignItems: 'center', height: '40px' }}> {params.row.quantity}</Box>
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton onClick={() => onRowExpand(params.row.id)}>
                                {params.row.id === clickedIndex ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Collapse in={params.row.id === clickedIndex}>
                        {[1, 2, 3].map((item, index) => (
                            <Box
                                px={clickedIndex > 0 && params.row.id === clickedIndex ? '10px' : 0}
                                sx={{
                                    bgcolor: '#F1F2F4', height: '120px', width: '100%',
                                    borderTop: index === 0 ? '2px solid #fff' : 'none',
                                    borderBottom: '1px solid #353535'
                                }}>
                                <Grid py={1} container xs={12}>
                                    <Grid item xs={2}>
                                        <Typography> 1</Typography> <br />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography sx={{ fontSize: '12px' }}>Note/ Comment: </Typography>
                                        <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>{params.row?.details?.comment} </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Collapse>
                </Box>
            )
        },
    ];

    const rows = [
        {
            id: 1, quantity: '1', price: '20 EUR', product: 'Potatoes', referenceId: '00100235', details: {
                comment: 'Can you please deliver before 11 am and pack separately the  vegetables and fruits? Thank you. ',
                user: {
                    email: 'mary@gmail.com',
                    name: 'Mary Jones',
                    phone: '+3512093894034'
                }
            }
        },
        {
            id: 2, quantity: '21', price: '5 EUR', product: 'Tomatoes', referenceId: '00100242', details: {
                comment: 'Can you please deliver before 11 am and pack separately the  vegetables and fruits? Thank you. ',
                user: {
                    email: 'george@gmail.com',
                    name: 'John James Smith',
                    phone: '+3512093894034'
                }
            }
        },
        { id: 3, quantity: '2', price: '12 EUR', product: 'Bracolli', referenceId: '00100245' },
        { id: 4, quantity: '2', price: '7 EUR', product: 'Avocado', referenceId: '00100216' },
        { id: 5, quantity: '2', price: '30 EUR', product: 'Rice', referenceId: '001002230' },
        { id: 6, quantity: '2', price: '15 EUR', product: 'Bananas', referenceId: '001002150' },
    ];

    return (
        <Box
            sx={{
                marginLeft: '100px',
                marginRight: '100px',
            }}
        >
            <Grid container xs={12}>
                <Grid px={0} item xs={2} >
                    <SidebarList />
                </Grid>
                <Grid item xs={10}>
                    <React.Fragment>
                        <Toolbar />
                        <StyledDataGrid
                            clickedIndex={clickedIndex}
                            autoHeight
                            padded={true}
                            rows={rows}
                            columns={columns}
                            hideFooterPagination
                            disableColumnMenu
                            disableSelectionOnClick
                        />
                    </React.Fragment>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PopStorePackings