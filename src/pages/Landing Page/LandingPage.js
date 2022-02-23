import React, { useEffect, useState } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";
import firebase from "../../service/firebase";
import { useDispatch } from "react-redux";
import { addUserInfo } from "../../redux/user";
import { updateTableData } from "../../redux/csvText";
import { useSelector } from "react-redux";
import "./styles.css";
import DataTable from "../../components/Data_Table/DataTable";
const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const text = useSelector((state) => state.csvText.text);

  var rows = [];

  // const sampleData = `
  // Model,mpg,cyl,disp,hp,drat,wt,qsec,vs,am,gear,carb
  // Mazda RX4,21,6,160,110,3.9,2.62,16.46,0,1,4,4
  // Mazda RX4 Wag,21,6,160,110,3.9,2.875,17.02,0,1,4,4
  // Datsun 710,22.8,4,108,93,3.85,2.32,18.61,1,1,4,1
  // Hornet 4 Drive,21.4,6,258,110,3.08,3.215,19.44,1,0,3,1
  // Hornet Sportabout,18.7,8,360,175,3.15,3.44,17.02,0,0,3,2
  // Valiant,18.1,6,225,105,2.76,3.46,20.22,1,0,3,1
  // Duster 360,14.3,8,360,245,3.21,3.57,15.84,0,0,3,4
  // Merc 240D,24.4,4,146.7,62,3.69,3.19,20,1,0,4,2
  // Merc 230,22.8,4,140.8,95,3.92,3.15,22.9,1,0,4,2
  // Fiat 128,32.4,4,78.7,66,4.08,2.2,19.47,1,1,4,1
  // `;

  const handleCSV = (data) => {
    if (data) {
      data
        .trim()
        .split("\n")
        .map((ele) => {
          var elem = ele.split(",");
          rows.push(elem);
        });
      setTableData(rows);
      dispatch(updateTableData(rows));
    }
  };

  useEffect(() => {
    handleCSV(text);
  }, [text]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.multiFactor.user);
        dispatch(addUserInfo(user.multiFactor.user));
        localStorage.setItem(
          "popstore_user_token",
          user.multiFactor.user.accessToken
        );
        navigate("/my-popstore");
      } else {
        navigate("/");
      }
    });
  }, [navigate, dispatch]);

  return (
    <Container maxWidth="lg">
      <CreateStoreForm />
      <div className="create-table-wrapper">
        <DataTable data={tableData} />
      </div>
      <div className="go-button">
        <Button component={Link} to="/map-your-data" variant="contained">
          Go
        </Button>
      </div>
    </Container>
  );
};

export default LandingPage;
