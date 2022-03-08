import React, { useEffect, useState } from "react";
import {
  Button, Grid, TextField
} from '@mui/material';
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";
import firebase from "../../service/firebase";
import DataTable from "../../components/Data_Table/DataTable";
import textToCellsParser from "../../functions/textToCellsParser";
import { signInWithGoogle } from "../../service/firebase";
import "./styles.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const LandingPage = () => {
  const navigate = useNavigate();

  const [sheetData, setSheetData] = useState([])
  const [pastedData, setPastedData] = useState('')

  const MySwal = withReactContent(Swal)

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text/plain')
    setPastedData(data)
    const cells = textToCellsParser(data)
    setSheetData(cells)
  }

  const saveSheet = async (e) => {
    const validation = sheetData.every(item => Array.isArray(item.cells) && item.cells.length);
    if(!validation) {
      await MySwal.fire({
        title: 'Error!',
        text: 'Please paste correct sheet data to proceed',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return
    }
    localStorage.setItem('sheetData', JSON.stringify(sheetData))
    e.preventDefault()
    await CheckLogin()
  }

  const CheckLogin = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      navigate('/popstore/create')
    } else {
      await signInWithGoogle()
    }
  }

  const clearSheet = () => {
    setSheetData([])
    setPastedData('')
  }

  useEffect(async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (localStorage.getItem('sheetData') !== null) {
          navigate('/popstore/create')
        } else {
          navigate("/")
        }
      }
    });
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs>
          <h1>Create Popstore from a spreadsheet</h1>
        </Grid>
      </Grid>
      <form onSubmit={saveSheet}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
                fullWidth
                id="outlined-basic"
                label="Create Popstore from a spreadsheet"
                helperText=""
                variant="outlined"
                onPaste={handlePaste}
                value={pastedData}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
          <Grid item xs={6} md={4}>
            <Button
                color="primary"
                variant="contained"
                disabled={!sheetData.length}
                onClick={saveSheet}>
              Go
            </Button>
          </Grid>
          <Grid item xs={6} md={4}>
            <Button
                color="secondary"
                variant="contained"
                disabled={typeof sheetData === 'undefined' || !sheetData.length}
                onClick={clearSheet}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </form>
      <div className="create-table-wrapper">
        <DataTable sheet={sheetData} />
      </div>
    </Container>
  );
};

export default LandingPage;
