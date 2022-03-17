import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { signInWithGoogle } from "../../service/firebase";
import LogoutButton from "../Logout Button/LogoutButton";
import firebase from "../../service/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateTableData } from "../../redux/csvText";
import  textToCellsParser from "../../functions/textToCellsParser";
import * as XLSX from "xlsx";
import "../CreateStoreForm/styles.css";

const CreateStoreForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userPhoto, setUserPhoto] = useState(null);
  const [pastedData, setPastedData] = useState()



  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const handlePaste = (e) => {
    const data = e.target.value;
    setPastedData(data)
    const cells = textToCellsParser(data)
    dispatch(updateTableData(cells))
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

        const data = XLSX.utils.sheet_to_csv(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      dispatch(updateTableData(d));
    });
  };

  return (
    <div className="create-store-wrapper">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography style={{ marginTop: "20px" }} variant="h5">
              Create Popstore from a spreadsheet
            </Typography>
          </Grid>
          <Grid className="login-button-wrapper" item xs={4}>
            {!userPhoto ? (
              <Button onClick={signInWithGoogle} variant="contained">
                Login
              </Button>
            ) : (
              <div className="logout-button">
                <LogoutButton user={userPhoto} />
              </div>
            )}
          </Grid>
        </Grid>
    
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              id="outlined-basic"
              label="Create Popstore from a spreadsheet"
              fullWidth
              variant="outlined"
              value={pastedData}
              multiline
              onChange={(e) => handlePaste(e)}
            />
          </Grid>
        </Grid>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
        />
      </Box>
    </div>
  );
};

export default CreateStoreForm;
