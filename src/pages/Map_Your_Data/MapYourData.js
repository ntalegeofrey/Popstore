import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, Input, FormHelperText } from "@mui/material";
import Grid from "@mui/material/Grid";

const MapYourData = () => {
  return (
    <Container maxWidth="lg">
      <Typography style={{ marginTop: "20px" }} variant="h5">
        Map your Data
      </Typography>
      <div>
        <FormControl>
          <Grid>
            <Grid item>
              <Typography style={{ marginTop: "20px" }} variant="p">
                Map your Data
              </Typography>
              <Input id="store-name" />
            </Grid>
          </Grid>
        </FormControl>
      </div>
    </Container>
  );
};

export default MapYourData;
