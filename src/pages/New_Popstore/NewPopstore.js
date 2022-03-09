import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
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
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [storeName, setStoreName] = useState('');
  const [storeOwner, setStoreOwner] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('SEK');
  const [sheetData, setSheetData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dbColumns, setDbColumns] = useState(['Select Column', 'Name', 'Reference ID', 'Price', 'Description', 'Ignore']);
  const [col, setCol] = useState({});

  const MySwal = withReactContent(Swal)
  const eurocurrencies={
    'Albania': 'ALL',
    'Andorra': 'EUR',
    'Armenia': 'AMD',
    'Austria': 'EUR',
    'Azerbaijan': 'AZN',
    'Belarus': 'BYN',
    'Belgium': 'EUR',
    'Bosnia and Herzegovina': 'BAM',
    'Bulgaria': 'BGN',
    'Croatia': 'HRK',
    'Cyprus': 'EUR',
    'Czechia': 'CZK',
    'Denmark': 'DKK',
    'Estonia': 'EUR',
    'Finland': 'EUR',
    'France': 'EUR',
    'Georgia': 'GEL',
    'Germany': 'EUR',
    'Greece': 'EUR',
    'Hungary': 'HUF',
    'Iceland': 'ISK',
    'Ireland': 'EUR',
    'Italy': 'EUR',
    'Latvia': 'EUR',
    'Liechtenstein': 'CHF',
    'Lithuania': 'EUR',
    'Luxembourg': 'EUR',
    'Malta': 'EUR',
    'Moldova': 'MDL',
    'Monaco': 'EUR',
    'Montenegro': 'EUR',
    'Netherlands': 'EUR',
    'North Macedonia': 'MKD',
    'Norway': 'NOK',
    'Poland': 'PLN',
    'Portugal': 'EUR',
    'Romania': 'RON',
    'Russia': 'RUB',
    'San Marino': 'EUR',
    'Serbia': 'RSD',
    'Slovakia': 'EUR',
    'Slovenia': 'EUR',
    'Spain': 'EUR',
    'Sweden': 'SEK',
    'Switzerland': 'CHF',
    'Turkey': 'TRY',
    'Ukraine': 'UAH',
    'United Kingdom': 'GBP',
    'Vatican City': 'EUR',
  }
  const [currencies, setCurrencies] = useState(eurocurrencies);

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
      localStorage.setItem('columns', JSON.stringify({
        'Name': -1, 'Reference ID': -1, 'Price': -1, "Description": -1, 'Ignore': 9
      }));
      setCol({
        'Name': -1, 'Reference ID': -1, 'Price': -1, "Description": -1, 'Ignore': 9
      });

    });
  }, [navigate]);

  const saveStore = async (e) => {
    e.preventDefault();
    let columns = JSON.parse(localStorage.getItem('columns'));
    let referenceIdColumn = columns['Reference ID'];
    let priceColumn = columns['Price'];
    let nameColumn = columns['Name'];
    let descriptionColumn = columns['Description'];

    if ( nameColumn === -1) {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select a column for Name of products',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( priceColumn === -1) {
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
          sheetData[i].cells[descriptionColumn] ? sheetData[i].cells[descriptionColumn] : ''
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
          sheetData[i].cells[descriptionColumn] ? sheetData[i].cells[descriptionColumn] : ''
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
      link: `https://popstore.bothofus.se/store/${user.uid}/${storeRef.id}`,
      columns: columns,
      locked: false,
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

  const updateSelectedColumn = async (e, column, index, c) => {
    let cols = localStorage.getItem('columns');
    cols = JSON.parse(cols);
    cols[column] = index;
    let tempValues = Object.values(cols);
    if(tempValues.includes(index)){
      let key = Object.keys(cols).find(key => cols[key] === index && key !== column);
      if(key !== undefined){
        cols[key] = -1;
      }
    }

    // Check price column for numeric values
    let productsPrices = [];
    let productsNames = [];
    for (let i = 0; i < sheetData.length; i++) {
      if((sheetData[i].cells[cols['Price']] === undefined && cols['Price'] !== -1) || (sheetData[i].cells[cols['Name']] === undefined && cols['Name'] !== -1)){
        continue;
      }
      productsPrices.push(parseFloat(sheetData[i].cells[cols['Price']]));
      productsNames.push(parseFloat(sheetData[i].cells[cols['Name']]));
    }

    let validNames = true;
    productsNames.forEach( (el, i) => {
      if(!Object.is(el, NaN)) {
        validNames = false;
      }
    });

    if(!validNames && cols['Name'] !== -1){
      await MySwal.fire({
        title: 'Error!',
        text: 'Name for all products cannot by only number. It should contain letters as well',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      if(document.getElementById(`${c}-${index}`)) {
        document.getElementById(`${c}-${index}`).textContent = 'Select Column';
      }
      return;
    }

    productsPrices[0] = 0;
    if(cols['Price'] !== -1 && productsPrices.includes(NaN)){
      await MySwal.fire({
        title: 'Error!',
        text: 'Price for all products must be a number',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      document.getElementById(`${c}-${index}`).textContent = 'Select Column';
      return;
    }
    // Same column information
    setCol(cols);
    if(document.getElementById(`${c}-${index}`)) {
      document.getElementById(`${c}-${index}`).textContent = column;
    }
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
            <Grid item xs={4} md={4}>
              <Select
                  fullWidth={true}
                  label="Select Column"
              >
                {Object.keys(currencies).map((currency, i) => (
                    <MenuItem
                        key={`${ i}`}
                        onClick={(e => updateCurrencyValue(currencies[currency]))}
                    >
                      {currencies[currency]}
                    </MenuItem>
                ))}
              </Select>
              </Grid>
            <Grid item xs={12} md={12}>
              <p><small>Reference Id and Description are optional. Reference Id is generated automatically if not selected</small></p>
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
                          {dbColumns.map((dbColumn, i) => (
                              <MenuItem
                                  disabled={col[dbColumn] !== -1 && dbColumn !== 'Ignore' && col[dbColumn] !== index}
                                  onClick={(e => updateSelectedColumn(e, dbColumn, index, column))}
                                  key={`${index}-${dbColumn}`}
                              >
                                {dbColumn}
                              </MenuItem>
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
