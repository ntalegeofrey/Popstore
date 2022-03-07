import React from "react";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { getAllOrdersByStore } from "../../api/orders";
import Loading from "../../components/Loading";

const PackagingPage = () => {
  const { storeOwnerID, storeID } = useParams();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [packaging, setPackaging] = React.useState([]);
  const [customers, setCustomers] = React.useState([
    { name: "Bright", quantity: 1 },
    { name: "John", quantity: 2 },
    { name: "Quoffie", quantity: 3 },
    { name: "Edwin", quantity: 4 },
  ]);
  const [selectedPackage, setSelectedPackage] = React.useState("");

  const updateSelectedPackage = (event) => {
    setSelectedPackage(event.target.value);
  };

  const getOrders = async () => {
    setLoading(true);
    const orders = await getAllOrdersByStore({ storeOwnerID, storeID });

    const orderByPackaging = groupOrdersByName(orders.docs);

    setOrders(orders.docs.map((order) => ({ id: order.id, ...order.data() })));
    setPackaging(orderByPackaging);
    setLoading(false);
  };

  const groupOrdersByName = (allOrders) => {
    const ordersByName = allOrders.reduce((allOrders, currentOrder) => {
      currentOrder.data().OrderedProducts.forEach((orderedProduct) => {
        const orderWithSameProductNameExists = allOrders.find(
          //here
          (orderByName) => orderByName.name === orderedProduct.name
        );
        if (orderWithSameProductNameExists) {
          allOrders.forEach((order) => {
            //here
            if (order.name === orderedProduct.name) {
              order.quantity += orderedProduct.quantity;
            }
          });
        } else {
          allOrders.push({
            name: orderedProduct.name,
            quantity: orderedProduct.quantity,
          }); //here
        }
      });
      return allOrders;
    }, []);
    return ordersByName;
  };

  const groupOrdersByCustomer = () => {
    const orderByCustomers = orders.reduce((allCustomers, currentOrder) => {
      currentOrder.OrderedProducts.forEach((orderedProduct) => {
        if (orderedProduct.name === selectedPackage) {
          const customerAdded = allCustomers.find(
            (customer) => customer.name === currentOrder.customerName
          );
          if (!customerAdded) {
            allCustomers.push({
              name: currentOrder.customerName,
              quantity: orderedProduct.quantity,
            });
          } else {
            customerAdded.quantity += orderedProduct.quantity;
          }
        }
      });
      return allCustomers;
    }, []);

    setCustomers(orderByCustomers);
    console.log(orderByCustomers);
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  React.useEffect(() => {
    console.log(orders);
    if (selectedPackage) groupOrdersByCustomer();
  }, [selectedPackage]);

  React.useEffect(() => {
    if (packaging.length) setSelectedPackage(packaging[0].name);
  }, [packaging]);

  if (loading) return <Loading />;

  return (
    <div>
      {packaging.map((packing) => (
        <Grid container key={packing.name}>
          <Grid item xs={6}>
            <Typography>{packing.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{packing.quantity}</Typography>
          </Grid>
        </Grid>
      ))}
      <Box my={2}>
        <Select
          id="packaging"
          value={selectedPackage}
          onChange={updateSelectedPackage}
        >
          {packaging.map((packing) => (
            <MenuItem
              value={packing.name}
              key={`${packaging.name}  ${packing.quantity}`}
            >
              {`${packing.name} - ${packing.quantity} ordered`}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Typography variant="h6">Orders, {selectedPackage}</Typography>
      {customers.map((customer) => (
        <Grid container mt={2} key={customer.name}>
          <Grid item xs={6}>
            <Typography>{customer.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{customer.quantity}</Typography>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default PackagingPage;
