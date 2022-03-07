const COLUMNS = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    type: "number",
    valueGetter: (params) => `${params.row.price} SEK`,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    width: 150,
  },
  {
    field: "total",
    headerName: "Total",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    type: "number",
    width: 170,
    valueGetter: (params) => `${params.row.quantity * params.row.price} SEK`,
  },
];

export { COLUMNS };
