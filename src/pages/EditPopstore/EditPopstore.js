import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {useNavigate, useParams} from "react-router-dom";
import firebase, {
  db,
  doc,
  updateDoc,
  collection,
  serverTimestamp, getDoc
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
import Loading from "../../components/Loading";

const NewPopstore = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [columns, setColumns] = useState([]);
  const [dbColumns, setDbColumns] = useState(['Reference ID', 'Name', 'Price']);
  const [col, setCol] = useState({});
  const [loading, setLoading] = useState(true);

  const MySwal = withReactContent(Swal)

  useEffect(async () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          console.log(data);
          setStore(data);
          setLoading(false);
        }

      } else {
        navigate("/");
      }

      localStorage.setItem('columns', JSON.stringify({
        'Name': -1, 'Reference ID': -1, 'Price': -1, 'Ignore': 9
      }));
      setCol({
        'Name': -1, 'Reference ID': -1, 'Price': -1, 'Ignore': 9
      });

    });
  }, [navigate]);

  const updateStore = async (e) => {
    e.preventDefault();

    if ( store.storeName.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please select a name for PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( store.storeOwner.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please add an email for PopStore owner',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if ( store.description.trim() == '') {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please add description for PopStore',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    let updatedStore = {
      storeName: store.storeName,
      storeOwner: store.storeOwner,
      description: store.description,
    }

    const storesRef = await collection(db, `/StoreOwners/${user.uid}/allStores`);
    const storeRef = await (doc(storesRef, storeId));

    await updateDoc(storeRef, updatedStore);

    await MySwal.fire({
      title: 'Success!',
      text: 'PopStore updated successfully',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    localStorage.removeItem('columns');
    navigate('/popstore/all');
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem('columns');
    navigate('/popstore/all');
  };

  useEffect(async () => {

  }, []);

  if (loading) return <Loading />;
  return (
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs>
            <h1>Edit your Popstore</h1>
          </Grid>
        </Grid>
        <form onSubmit={updateStore}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
              <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Store Name"
                  helperText=""
                  variant="outlined"
                  value={store.storeName}
                  onChange={(e) => setStore({...store, storeName: e.target.value})}
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
                  value={store.storeOwner}
                  onChange={(e) => setStore({...store, storeOwner: e.target.value})}
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
                  value={store.description}
                  onChange={(e) => setStore({...store, description: e.target.value})}
              />
            </Grid>
          </Grid>
        </form>
        <div className="create-table-wrapper">
          <TableContainer>
            <Table style={{ tableLayout: 'fixed'}}>
              <TableHead>
                <TableRow>
                  {dbColumns?.map((column, index) => (
                      <TableCell key={index}>
                        {column}
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                { store.columnsList?.map((row, rowIndex) => {
                  return (
                      <TableRow key={`row-${rowIndex}`}>
                        { row.map((cell, cellIndex) => (
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
                onClick={updateStore}>
              Update PopStore
            </Button>
          </Grid>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
        </Grid>
      </Container>
  );
};

export default NewPopstore;
