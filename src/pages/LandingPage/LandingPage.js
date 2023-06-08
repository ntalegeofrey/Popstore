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
import DashboardTooltip from "../../components/DashboardTooltip";
import StoreCardComponent from "../../components/StoreCard/storeCard";
import { DashboardTooltipsContext } from "../../context/useDashboardTooltips";

const LandingPage = () => {
  const navigate = useNavigate();

  const [sheetData, setSheetData] = useState([]);
  const [pastedData, setPastedData] = useState("");
  const [user, setUser] = useState();
  const [showDataTable, setShowDataTable] = useState(false);

  const tooltipEls = useRef([]);

  const addTooltipRef = (el, index)=>{
    return (tooltipEls.current[index] = el)
  }

 
  const MySwal = withReactContent(Swal);

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
    <DashboardTooltipsContext.Provider value={{ refs: tooltipEls, addTooltipRef }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs>
            <Typography
              variant="h2"
              color="text.main"
              sx={{ pb: 4, pt: 4, fontWeight: "light" }}
            >
              Create Popstore from a spreadsheet
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={saveSheet}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <DashboardTooltip>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Create Popstore from a spreadsheet"
                  helperText=""
                  variant="outlined"
                  onPaste={handlePaste}
                  value={pastedData}
                  inputRef={(el) => addTooltipRef(el, 0)}
                />
              </DashboardTooltip>
            </Grid>
            <Grid item xs={6} md={3}>
              <DashboardTooltip>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!sheetData.length}
                  onClick={handleOpenModal}
                  sx={{ width: "100%" }}
                  ref={(el) => addTooltipRef(el, 1)}
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
        {showDataTable && (
          <div className="create-table-wrapper">
            <DataTable sheet={sheetData} />
          </div>
        )}
        <Grid container spacing={2} marginBottom="30px">
          <Grid item xs={12} md={2}>
            <PostoreIndicator />
          </Grid>
          <Grid item xs={12} md={2}>
            <DataIndicator />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <StoreCardComponent name="gfgsc" />
          </Grid>
        </Grid>
      </Container>
    </DashboardTooltipsContext.Provider>
  );
};

export default LandingPage;
