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
import { useDispatch } from "react-redux";
import { updateText } from "../../redux/csvText";
import "../CreateStoreForm/styles.css";

const CreateStoreForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userPhoto, setUserPhoto] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserPhoto(user.multiFactor.user.photoURL);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleText = (e) => {
    dispatch(updateText(e.target.value));
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
              multiline
              onChange={(e) => handleText(e)}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CreateStoreForm;
