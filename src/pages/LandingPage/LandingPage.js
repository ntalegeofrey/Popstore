import { Button, Grid, TextField, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataTable from "../../components/DataTable/DataTable";
import StoreCardComponent from "../../components/StoreCard/storeCard";
import {
  DataIndicator,
  PostoreIndicator,
} from "../../components/Styles/styledIndicators";
import PopUpModal from "../../components/Styles/styledLoginPopUp";
import textToCellsParser from "../../funcs/textToCellsParser";
import firebase, {
  collection,
  db,
  getDocs,
  orderBy,
  query,
  signInWithGoogle,
} from "../../service/firebase";
import "./styles.css";
import { StyledTextField } from "../../components/Styles/styledTextField";

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
      <Grid container>
        <Grid item>
          <Typography
            color="majorBlack"
            fontWeight={300}
            fontSize="32px"
            lineHeight="43.58px"
            sx={{ pb: "14px", fontWeight: "light" }}
          >
            Create Popstore from a spreadsheet
          </Typography>
        </Grid>
      </Grid>
      <form onSubmit={saveSheet}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              id="outlined-basic"
              label="Paste the data for a spreadsheet here "
              helperText=""
              variant="outlined"
              onPaste={handlePaste}
              value={pastedData}
              sx={{ width: "549px", height: "53px" }}
            />
          </Grid>
          <Grid container item xs={6} md={3} justifyContent="flex-end">
            <Button
              id="step2"
              color="primary"
              variant="contained"
              disabled={!sheetData.length}
              onClick={handleOpenModal}
              sx={{ width: "175px", height: "40px" }}
            >
              Create PopStore
            </Button>
            <PopUpModal
              open={openModal}
              onClose={handleCloseModal}
              saveSheet={saveSheet}
            />
          </Grid>
          <Grid container item xs={6} md={3} justifyContent="flex-end">
            {" "}
            <Button
              color="secondary"
              variant="outlined"
              disabled={typeof sheetData === "undefined" || !sheetData.length}
              onClick={clearSheet}
              sx={{ width: "175px", height: "40px" }}
            >
              Clear Data
            </Button>
          </Grid>
        </Grid>
      </form>
      {showDataTable && (
        <div className="create-table-wrapper">
          <DataTable sheet={sheetData} />
        </div>
      )}
      <Grid container marginTop="30px">
        <Grid item xs={12} md={2}>
          <PostoreIndicator popstores={storeCount} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DataIndicator dataUsage={dataUsage} />
        </Grid>
      </Grid>
      <div style={{ width: "100%" }}>
        <Grid container sx={{ marginTop: "59px" }}>
          <Grid item xs={12}>
            {user && <StoreCardComponent name="gfgsc" />}
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default LandingPage;
