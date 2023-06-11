import React, { useEffect, useState, useRef } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import firebase from "../../service/firebase";
import DataTable from "../../components/DataTable/DataTable";
import textToCellsParser from "../../functions/textToCellsParser";
import { signInWithGoogle } from "../../service/firebase";
import "./styles.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  DataIndicator,
  PostoreIndicator,
} from "../../components/Styles/styledIndicators";
import PopUpModal from "../../components/Styles/styledLoginPopUp";
import StoreCardComponent from "../../components/StoreCard/storeCard";
import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
} from "../../service/firebase";
import DashboardTooltip from "../../components/DashboardTooltip/DashboardTooltip";

const LandingPage = () => {
  const navigate = useNavigate();

  const [sheetData, setSheetData] = useState([]);
  const [pastedData, setPastedData] = useState("");
  const [user, setUser] = useState();
  const [showDataTable, setShowDataTable] = useState(false);
  const [dataUsage, setDataUsage] = useState(0);
  const [storeCount, setStoreCount] = useState(0);

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        let temp = [];
        const allStores = query(
          collection(db, `/StoreOwners/${user.uid}/allStores`),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(allStores);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          temp.push(doc.data());
        });
        const mbUsage = (array) => {
          const jsonString = JSON.stringify(array);

          // Calculate the size of the JSON string in bytes
          const bytes = new TextEncoder().encode(jsonString).length;

          // Calculate the size in megabytes (MB)
          const kilobytes = bytes / 1024;
          const megabytes = kilobytes / 1024;

          return megabytes.toFixed(3);
        };

        setStoreCount(temp.length);
        setDataUsage(mbUsage(temp));
      }
    });
  }, []);

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text/plain");
    setPastedData(data);
    const cells = textToCellsParser(data);
    setSheetData(cells);
    setShowDataTable(true);
  };

  const saveSheet = async (e) => {
    const validation = sheetData.every(
      (item) => Array.isArray(item.cells) && item.cells.length
    );
    if (!validation) {
      await MySwal.fire({
        title: "Error!",
        text: "Please paste correct sheet data to proceed",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    localStorage.setItem("sheetData", JSON.stringify(sheetData));
    e.preventDefault();
    await CheckLogin();
  };

  const CheckLogin = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      navigate("/popstore/create");
    } else {
      await signInWithGoogle();
    }
  };

  const clearSheet = () => {
    setSheetData([]);
    setPastedData("");
    setShowDataTable(false);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        if (localStorage.getItem("sheetData") !== null) {
          navigate("/popstore/create");
        } else {
          navigate("/");
        }
      }
    });
  }, [navigate]);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = async (e) => {
    if (!user) {
      setOpenModal(true);
    } else {
      await saveSheet(e);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item>
          <Typography
            variant="h2"
            color="text.main"
            sx={{ pb: 4, fontWeight: "light" }}
          >
            Create Popstore from a spreadsheet
          </Typography>
        </Grid>
      </Grid>
      <form onSubmit={saveSheet}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <DashboardTooltip messageIndex={0}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Create Popstore from a spreadsheet"
                helperText=""
                variant="outlined"
                onPaste={handlePaste}
                value={pastedData}
              />
            </DashboardTooltip>
          </Grid>
          <Grid item xs={6} md={3}>
            <DashboardTooltip messageIndex={1}>
              <Button
                color="primary"
                variant="contained"
                disabled={!sheetData.length}
                onClick={handleOpenModal}
                sx={{ width: "100%" }}
              >
                Create PopStore
              </Button>
            </DashboardTooltip>
            <PopUpModal
              open={openModal}
              onClose={handleCloseModal}
              saveSheet={saveSheet}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              color="secondary"
              variant="outlined"
              disabled={typeof sheetData === "undefined" || !sheetData.length}
              onClick={clearSheet}
              sx={{ width: "100%" }}
            >
              Clear Data
            </Button>
          </Grid>
        </Grid>
      </form>
      <form>
        {showDataTable && (
          <div className="create-table-wrapper">
            <DataTable sheet={sheetData} />
          </div>
        )}
      </form>
      {showDataTable && (
        <div className="create-table-wrapper">
          <DataTable sheet={sheetData} />
        </div>
      )}
      <Grid container spacing={2} marginBottom="30px">
        <Grid item xs={12} md={2}>
          <PostoreIndicator popstores={storeCount} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DataIndicator dataUsage={dataUsage} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <StoreCardComponent name="gfgsc" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
