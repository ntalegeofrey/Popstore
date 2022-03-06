import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import firebase, {
  db,
  doc,
  setDoc,
  collection,
  serverTimestamp
} from "../../service/firebase";
import {
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import styles from "../../components/Data_Table/Sheets.module.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const NewPopstore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [storeName, setStoreName] = useState('');
  const [storeOwner, setStoreOwner] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('SEK');
  const [sheetData, setSheetData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dbColumns, setDbColumns] = useState(['Name', 'Reference ID', 'Price', 'Ignore']);

  const MySwal = withReactContent(Swal)

  useEffect(async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setStoreOwner(user.email);
      } else {
        navigate("/");
      }
      if (localStorage.getItem('sheetData') !== null) {
        let data = JSON.parse(localStorage.getItem('sheetData'));
        setSheetData(data);
        setColumns(data[0].cells);
      } else {
        navigate("/");
      }

      if (localStorage.getItem('columns') == null) {
        localStorage.setItem('columns', JSON.stringify({
          'Name': -1, 'Reference ID': -1, 'Price': -1
        }));
      }

    });
  }, [navigate, dispatch]);

  const saveStore = async (e) => {
    e.preventDefault();
    let columns = JSON.parse(localStorage.getItem('columns'));
    let referenceIdColumn = columns['Reference ID'];
    let priceColumn = columns['Price'];
    let nameColumn = columns['Name'];

    if ( nameColumn === -1) {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select a column for Name of products',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( nameColumn === -1) {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select a column for Price of products',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( storeName.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select a name for PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( storeOwner.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please add an email for PopStore owner',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( storeDescription.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please add description for PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if(
        columns['Reference ID'] == columns['Price']
        || columns['Reference ID'] == columns['Name']
        || columns['Price'] == columns['Name']
    ){
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select different columns for Reference ID, Price and Name',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    let productsPrices = [];

    let products = [];

    if(referenceIdColumn === -1){
      for (let i = 0; i < sheetData.length; i++) {
        if(sheetData[i].cells[nameColumn] == undefined || sheetData[i].cells[priceColumn] == undefined){
          continue;
        }
        products.push([
          i,
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
        ]);
        productsPrices.push(parseFloat(sheetData[i].cells[priceColumn]));
      }
    } else {
      for (let i = 0; i < sheetData.length; i++) {
        if(sheetData[i].cells[nameColumn] == undefined || sheetData[i].cells[priceColumn] == undefined || sheetData[i].cells[referenceIdColumn] == undefined){
          continue;
        }
        products.push([
          sheetData[i].cells[referenceIdColumn],
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
        ]);
        productsPrices.push(parseFloat(sheetData[i].cells[priceColumn]));
      }
    }

    // Reset the column name to 0
    productsPrices[0] = 0;
    if(productsPrices.includes(NaN)){
      await MySwal.fire({
        title: 'Error!',
        text: 'Price for all products must be a number',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }


    const storesRef = doc(collection(db, "StoreOwners"), user.uid);
    const storeRef = doc(collection(storesRef, "allStores"));

    let store = {
      storeName: storeName,
      storeOwner: storeOwner,
      description: storeDescription,
      currency: storeCurrency,
      ownerID: user.uid,
      storeID: storeRef.id,
      createAt: serverTimestamp(),
      columnsList: JSON.stringify(products),
      link: 'https://popstore.bothofus.se/store/' + storeRef.id,
      columns: columns,
    }

    await setDoc(storeRef, store);

    await MySwal.fire({
      title: 'Success!',
      text: 'PopStore created successfully',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    localStorage.removeItem('columns');
    localStorage.removeItem('sheetData');
    navigate('/popstore/all');
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem('sheetData');
    localStorage.removeItem('columns');
    navigate('/');
  };

  const updateSelectedColumn = async (e, col, index) => {
    e.preventDefault();
    let cols = localStorage.getItem('columns');
    cols = JSON.parse(cols);
    cols[col] = index;
    localStorage.setItem('columns', JSON.stringify(cols));
  };

  useEffect(async () => {

  }, []);

  return (
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs>
            <h1>Map your data</h1>
          </Grid>
        </Grid>
        <form onSubmit={saveStore}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Store Name"
                  helperText=""
                  variant="outlined"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Store Owner"
                  helperText=""
                  type="email"
                  variant="outlined"
                  value={storeOwner}
                  onChange={(e) => setStoreOwner(e.target.value)}
              />
            </Grid>
            <Grid item xs={4} md={4} alignContent="end">
              <LogoutButton user={user?.photoURL} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Store Description"
                  helperText=""
                  variant="outlined"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </form>
        <div className="create-table-wrapper">
          <TableContainer>
            <Table style={{ tableLayout: 'fixed'}}>
              <TableHead>
                <TableRow>
                  {columns?.map((column, index) => (
                      <TableCell key={index}>
                        <Select
                            fullWidth={true}
                            id={`${column}-${index}`}
                            label="Select Column"
                        >
                          <MenuItem value='Select Column' selected={true}>Select Column</MenuItem>
                          {dbColumns.map((dbColumn, i) => (
                              <MenuItem value={{dbColumn: index}} onClick={(e => updateSelectedColumn(e, dbColumn, index))}>{dbColumn}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                { sheetData?.map((row, rowIndex) => {
                  return (
                      <TableRow key={`row-${rowIndex}`}>
                        { row.cells.map((cell, cellIndex) => (
                            <TableCell
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className={styles['cell']}>
                              {cell}
                            </TableCell>
                        ))}
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
          <Grid item xs={6} md={6} alignContent='end'>
            <Link
                href="#"
                onClick={cancelStore}>
              Cancel
            </Link>
            &nbsp;
            <Button
                style={{marginLeft: '1rem'}}
                color="primary"
                variant="contained"
                onClick={saveStore}>
              Create PopStore
            </Button>
          </Grid>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
        </Grid>
      </Container>
  );
};

export default NewPopstore;
