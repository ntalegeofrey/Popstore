import React, { useEffect, useState } from "react";
import {
  Button, Grid, TextField, Input
} from '@mui/material';
import Container from "@mui/material/Container";
import {useNavigate, Link, useParams} from "react-router-dom";
import firebase from "../../service/firebase";
import { useDispatch } from "react-redux";
import user, { addUserInfo } from "../../redux/user";
import { updateTableData } from "../../redux/csvText";
import { v4 as uuidv4 } from 'uuid'
import { useSelector } from "react-redux";
import DataTable from "../../components/Data_Table/DataTable";
import textToCellsParser from "../../functions/textToCellsParser";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  setDoc,
  updateDoc,
  signInWithGoogle
} from "../../service/firebase";
import "./styles.css";
import * as XLSX from "xlsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.csvText.tableData);
  var userId;

  const [sheetData, setSheetData] = useState()
  const [pastedData, setPastedData] = useState('')
  const [sheetUrl, setSheetUrl] = useState()
  const [creating, setCreating] = useState(false)

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text/plain')
    setPastedData(data)
    const cells = textToCellsParser(data)
    setSheetData(cells)
    console.log(cells)
  }

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_txt(ws);
        resolve(textToCellsParser(data));
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setSheetData(d)
    });
  };

  const saveSheet = async (e) => {
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
    setSheetUrl('')
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
  }, [navigate, dispatch]);

  const checkIfExists = async (userData) => {
    const storeOwners = collection(db, "StoreOwners");
    const q = query(storeOwners, where("email", "==", userData.email));
    var queryUser;
    var tempId;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      queryUser = doc.data();
      tempId = doc.id;
      localStorage.setItem("poolfarm_user_id", doc.id);
    });

    if (queryUser === undefined) {
      addDoc(storeOwners, {
        id: userId,
        createTime: serverTimestamp(),
        image: userData.photoURL,
        name: userData.displayName,
        phone: userData.phoneNumber,
        email: userData.email
      });
    }
  };

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
          <Grid item xs={12} md={8}>
            <p>Or import an excel sheet</p>
            <Input
                type="file"
                variant="outlined"
                label="Create Popstore from a spreadsheet"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}><p>&nbsp;</p></Grid>
          <Grid item xs={6} md={4}>
            <Button
                color="primary"
                variant="contained"
                disabled={!sheetData || creating || typeof sheetUrl !== 'undefined'}
                onClick={saveSheet}>
              Go
            </Button>
          </Grid>
          <Grid item xs={6} md={4}>
            <Button
                color="secondary"
                variant="contained"
                disabled={creating || typeof sheetData === 'undefined'}
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
