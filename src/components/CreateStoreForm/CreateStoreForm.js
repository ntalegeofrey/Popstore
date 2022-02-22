import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { signInWithGoogle } from "../../service/firebase";
import "./styles.css";

const CreateStoreForm = () => {
  return (
    <div className="create-store-wrapper">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography style={{ marginBottom: "20px" }} variant="h5">
              Create Popstore from a spreadsheet
            </Typography>
          </Grid>
          <Grid className="login-button-wrapper" item xs={4}>
            <Button onClick={signInWithGoogle} variant="contained">
              Login
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              id="outlined-basic"
              label="Create Popstore from a spreadsheet"
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CreateStoreForm;
