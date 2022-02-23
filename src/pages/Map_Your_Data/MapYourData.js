import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { InputLabel, OutlinedInput } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import LogoutButton from "../../components/Logout Button/LogoutButton";
import DataTable from "../../components/Data_Table/DataTable";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const MapYourData = () => {
  const tableData = useSelector((state) => state.csvText.tableData);
  const [age, setAge] = React.useState("");
  const [options, setOptions] = useState([]);
  const [data, setData] = useState(tableData);
  let temp = [];

  const handleChange = (event, ele, i) => {
    console.log(i);
    var newList = [];
    temp = data;
    temp.map((ele) => {
      var tempArray = [...ele];
      tempArray.splice(i, 1);
      newList.push(tempArray);
    });
    setData(newList);
    console.log(newList);

    setAge(event.target.value);
  };

  //   ele.map((elem) => {
  //     //   console.log(elem);
  //     });
  // newList = ele.filter((item) => ele.indexOf(item) !== i);
  // ele.map((item) => console.log(ele.indexOf(item) === i));
  useEffect(() => {
    tableData[0].map((ele) => {
      temp.push({
        name: ele,
        opt: "select"
      });
    });
    setOptions(temp);
  }, []);
  return (
    <Container maxWidth="lg">
      <Typography style={{ marginTop: "20px" }} variant="h5">
        Map your Data
      </Typography>
      <div style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Grid container>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                  >
                    <Typography align="left" mt={0} variant="p">
                      Store name
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput variant="outlined" id="store-name" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Store owner
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput variant="outlined" id="store-name" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{ marginTop: "20px" }} container>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Description
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput variant="outlined" id="store-name" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <Grid container>
                  <Grid
                    alignItems="center"
                    justifyContent="center"
                    container
                    spacing={2}
                    item
                    md={6}
                    md={6}
                  >
                    Currency
                  </Grid>
                  <Grid item md={6}>
                    <OutlinedInput variant="outlined" id="store-name" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <LogoutButton />
          </Grid>
        </Grid>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          {tableData[0].map((ele, i) => {
            return (
              <Grid key={i} item>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id={`${ele}-label`}>{ele}</InputLabel>
                  <Select
                    labelId={`${ele}-label`}
                    id={`${ele}`}
                    // value={ele}
                    label={ele}
                    onChange={(e) => handleChange(e, ele, i)}
                  >
                    <MenuItem value="select">Select</MenuItem>
                    <MenuItem value="ignore">Ignore</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            );
          })}
        </Grid>
        {/* <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="1-label">{1}</InputLabel>
          <Select
            labelId={`1-label`}
            id={`${1}`}
            value={age}
            label={1}
            onChange={handleChange}
          >
            <MenuItem value="select">Select</MenuItem>
            <MenuItem value="ignore">Ignore</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="2-label">{2}</InputLabel>
          <Select
            labelId={`2-label`}
            id={`${2}`}
            value={age}
            label={2}
            onChange={handleChange}
          >
            <MenuItem value="select">Select</MenuItem>
            <MenuItem value="ignore">Ignore</MenuItem>
          </Select>
        </FormControl> */}
        <DataTable data={data} />
      </div>
      <div style={{ marginTop: "20px", marginBottom: "20px", float: "right" }}>
        <Button component={Link} to="/map-your-data" variant="text">
          Cancel
        </Button>
        <Button component={Link} to="/map-your-data" variant="contained">
          Create Popstore
        </Button>
      </div>
    </Container>
  );
};

export default MapYourData;
