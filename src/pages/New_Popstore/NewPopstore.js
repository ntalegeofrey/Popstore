import React, { useEffect, useState } from "react";
import CreateStoreForm from "../../components/CreateStoreForm/CreateStoreForm";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import DataTable from "../../components/Data_Table/DataTable";
import { useSelector, useDispatch } from "react-redux";
import { updateTableData } from "../../redux/csvText";
import { Link } from "react-router-dom";
import {
  db,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  updateDoc
} from "../../service/firebase";
const NewPopstore = () => {
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);
  const text = useSelector((state) => state.csvText.text);
  var rows = [];

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

  useEffect(async () => {
    const columns = collection(
      db,
      "StoreOwners",
      "tD4KfLi7mKakIAl3wvcQuBR1Wyw2",
      "allStores",
      "YcgLsohfAT8ZLZkVdcPK",
      "Colums"
    );
    const querySnapshot = await getDocs(columns);
    console.log("columns", querySnapshot);
  }, []);

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

export default NewPopstore;
