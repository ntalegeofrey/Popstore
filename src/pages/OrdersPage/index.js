import { Box, Toolbar } from '@mui/material';
import { GridFooterContainer } from '@mui/x-data-grid';
import { StyledDataGrid, StyledDataGridFooterTypography } from '../../components/Styles/styledDataGrid';

const columns = [
    {
        field: 'referenceId',
        headerName: 'Reference ID',
        width: 150,
        flex: 0.100,
        sortable: false,

    },
    {
        field: 'product',
        headerName: 'Product',
        flex: 0.100,
        width: 150,
        sortable: false,
    },
    {
        field: 'price',
        headerName: 'Price',
        flex: 0.100,
        width: 150,
        sortable: false,
    },
    {
        field: 'quantity',
        headerName: 'Quantity',
        flex: 0.100,
        width: 150,
        sortable: false,
    },
    {
        field: 'amount',
        headerName: 'Amount',
        flex: 0.100,
        width: 150,
        sortable: false,
    }
];

export function CustomFooterComponent() {
    return (
        <GridFooterContainer sx={{ py: 2, display: 'flex' }}>
            <Box p={3} sx={{ display: 'flex', bgcolor: '#F1F2F4', ml: 'auto', width: '341px' }} component='div'>
                <StyledDataGridFooterTypography text={true} >Total:</StyledDataGridFooterTypography>
                <StyledDataGridFooterTypography text={false}>16,6 EUR</StyledDataGridFooterTypography>
            </Box>
        </GridFooterContainer>
    );
}

const PopStoreOrders = () => {

    const rows = [
        { id: 1, quantity: '2', amount: '30 EUR', price: '20 EUR', product: 'Potatoes', referenceId: '00100235' },
        { id: 2, quantity: '2', amount: '30 EUR', price: '5 EUR', product: 'Tomatoes', referenceId: '00100242' },
        { id: 3, quantity: '2', amount: '30 EUR', price: '12 EUR', product: 'Bracolli', referenceId: '00100245' },
        { id: 4, quantity: '2', amount: '30 EUR', price: '7 EUR', product: 'Avocado', referenceId: '00100216' },
        { id: 5, quantity: '2', amount: '30 EUR', price: '30 EUR', product: 'Rice', referenceId: '001002230' },
        { id: 6, quantity: '2', amount: '30 EUR', price: '15 EUR', product: 'Bananas', referenceId: '001002150' },
        { id: 7, quantity: '2', amount: '30 EUR', price: '2 EUR', product: 'Maize', referenceId: '00100244' },
        { id: 8, quantity: '2', amount: '30 EUR', price: '18 EUR', product: 'Rossini', referenceId: '00100236' },
        { id: 9, quantity: '2', amount: '30 EUR', price: '12 EUR', product: 'Harvey', referenceId: '00100265' },
    ];

    return (
        <Box>
            <Toolbar />
            <StyledDataGrid
                autoHeight
                rows={rows}
                padded={false}
                columns={columns}
                hideFooterPagination
                disableColumnMenu
                components={{ Footer: CustomFooterComponent }}
            />
        </Box>
    )
}

export default PopStoreOrders;