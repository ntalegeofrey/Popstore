import { Box, Toolbar } from '@mui/material';
import { StyledDataGrid } from '../../components/Styles/styledDataGrid';

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
        field: 'quantity',
        headerName: 'Quantity',
        flex: 0.100,
        width: 150,
        sortable: false,
    }
];

const PopStorePackings = () => {

    const rows = [
        { id: 1, quantity: '2', price: '20 EUR', product: 'Potatoes', referenceId: '00100235' },
        { id: 2, quantity: '2', price: '5 EUR', product: 'Tomatoes', referenceId: '00100242' },
        { id: 3, quantity: '2', price: '12 EUR', product: 'Bracolli', referenceId: '00100245' },
        { id: 4, quantity: '2', price: '7 EUR', product: 'Avocado', referenceId: '00100216' },
        { id: 5, quantity: '2', price: '30 EUR', product: 'Rice', referenceId: '001002230' },
        { id: 6, quantity: '2', price: '15 EUR', product: 'Bananas', referenceId: '001002150' },
    ];
    return (
        <Box>
            <Toolbar />
            <StyledDataGrid
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