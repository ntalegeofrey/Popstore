import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import firebase, {
  db,
  doc,
  setDoc,
  collection,
  serverTimestamp,
} from "../../service/firebase";
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styles from "../../components/DataTable/Sheets.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { StyledTextField } from "../../components/Styles/styledTextField";
import { CreatePopstoreBox } from "../../components/Styles/styledCreatePopstoreBox.js";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ErrorAlert,
  SuccessAlert,
} from "../../components/Styles/styledNotificationAlerts";

const NewPopstore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [storeName, setStoreName] = useState("");
  const [storeOwner, setStoreOwner] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [storeDescription, setStoreDescription] = useState("");
  const [storeCurrency, setStoreCurrency] = useState("SEK");
  const [sheetData, setSheetData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dbColumns] = useState([
    "Select Column",
    "Name",
    "Reference ID",
    "Price",
    "Ignore",
  ]);
  const [col, setCol] = useState({});

  const handleAlert = async (type, message) => {
    await setAlert({ type, message });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = async (e) => {
    setOpenModal(true);
  };

  const eurocurrencies = {
    Albania: "ALL",
    Andorra: "EUR",
    Armenia: "AMD",
    Austria: "EUR",
    Azerbaijan: "AZN",
    Belarus: "BYN",
    Belgium: "EUR",
    "Bosnia and Herzegovina": "BAM",
    Bulgaria: "BGN",
    Croatia: "HRK",
    Cyprus: "EUR",
    Czechia: "CZK",
    Denmark: "DKK",
    Estonia: "EUR",
    Finland: "EUR",
    France: "EUR",
    Georgia: "GEL",
    Germany: "EUR",
    Greece: "EUR",
    Hungary: "HUF",
    Iceland: "ISK",
    Ireland: "EUR",
    Italy: "EUR",
    Latvia: "EUR",
    Liechtenstein: "CHF",
    Lithuania: "EUR",
    Luxembourg: "EUR",
    Malta: "EUR",
    Moldova: "MDL",
    Monaco: "EUR",
    Montenegro: "EUR",
    Netherlands: "EUR",
    "North Macedonia": "MKD",
    Norway: "NOK",
    Poland: "PLN",
    Portugal: "EUR",
    Romania: "RON",
    Russia: "RUB",
    "San Marino": "EUR",
    Serbia: "RSD",
    Slovakia: "EUR",
    Slovenia: "EUR",
    Spain: "EUR",
    Sweden: "SEK",
    Switzerland: "CHF",
    Turkey: "TRY",
    Ukraine: "UAH",
    "United Kingdom": "GBP",
    "Vatican City": "EUR",
  };
  const [currencies] = useState(eurocurrencies);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setStoreOwner(user.email);
      } else {
        navigate("/");
      }
      if (localStorage.getItem("sheetData") !== null) {
        let data = JSON.parse(localStorage.getItem("sheetData"));
        setSheetData(data);
        setColumns(data[0].cells);
      } else {
        navigate("/");
      }
      localStorage.setItem(
        "columns",
        JSON.stringify({
          Name: -1,
          "Reference ID": -1,
          Price: -1,
          Ignore: 9,
        })
      );
      setCol({
        Name: -1,
        "Reference ID": -1,
        Price: -1,
        Ignore: 9,
      });
    });
  }, [navigate]);

  const saveStore = async (e) => {
    e.preventDefault();
    let columns = JSON.parse(localStorage.getItem("columns"));
    let referenceIdColumn = columns["Reference ID"];
    let priceColumn = columns["Price"];
    let nameColumn = columns["Name"];
    let descriptionColumn = columns["Description"];

    if (nameColumn === -1) {
      await handleAlert(
        "error",
        "Please select a column for name of products."
      );
      handleOpenModal();
      return;
    }

    if (priceColumn === -1) {
      await handleAlert(
        "error",
        "Please select a column for price of products."
      );
      handleOpenModal();
      return;
    }

    if (storeName.trim() === "") {
      await handleAlert("error", "Please select name of popstore");
      handleOpenModal();
      return;
    }

    if (storeOwner.trim() === "") {
      await handleAlert("error", "Please add an email for postore owner.");
      handleOpenModal();
      return;
    }

    if (storeDescription.trim() === "") {
      await handleAlert("error", "Please add description of popstore");
      handleOpenModal();
      return;
    }

    let productsPrices = [];

    let products = [];

    if (referenceIdColumn === -1) {
      for (let i = 0; i < sheetData.length; i++) {
        if (
          sheetData[i].cells[nameColumn] === undefined ||
          sheetData[i].cells[priceColumn] === undefined
        ) {
          continue;
        }
        products.push([
          i,
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
          sheetData[i].cells[descriptionColumn]
            ? sheetData[i].cells[descriptionColumn]
            : "",
        ]);
        productsPrices.push(parseFloat(sheetData[i].cells[priceColumn]));
      }
    } else {
      for (let i = 0; i < sheetData.length; i++) {
        if (
          sheetData[i].cells[nameColumn] === undefined ||
          sheetData[i].cells[priceColumn] === undefined ||
          sheetData[i].cells[referenceIdColumn] === undefined
        ) {
          continue;
        }
        products.push([
          sheetData[i].cells[referenceIdColumn],
          sheetData[i].cells[nameColumn],
          sheetData[i].cells[priceColumn],
          sheetData[i].cells[descriptionColumn]
            ? sheetData[i].cells[descriptionColumn]
            : "",
        ]);
        productsPrices.push(parseFloat(sheetData[i].cells[priceColumn]));
      }
    }

    // Reset the column name to 0
    productsPrices[0] = 0;
    if (productsPrices.includes(NaN)) {
      await handleAlert("error", "Price for all products must be a number.");
      handleOpenModal();
      return;
    }

    const storesRef = doc(collection(db, "StoreOwners"), user.uid);
    const storeRef = doc(collection(storesRef, "allStores"));

    let store = {
      storeName: storeName,
      storeOwner: storeOwner,
      description: storeDescription,
      currency: storeCurrency,
      ownerID: user.uid,
      storeID: storeRef.id,
      createAt: serverTimestamp(),
      columnsList: JSON.stringify(products),
      link: `https://popsto.re/store/${user.uid}/${storeRef.id}`,
      columns: columns,
      locked: false,
    };

    async function createStore() {
      await setDoc(storeRef, store);
      localStorage.removeItem("columns");
      localStorage.removeItem("sheetData");
      await handleAlert(
        "success",
        "Your Popstore has been created successfully:)"
      );
    }

    createStore().then(() => handleOpenModal());
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem("sheetData");
    localStorage.removeItem("columns");
    navigate("/");
  };
  const updateCurrencyValue = (e) => {
    setStoreCurrency(e.target.value);
  };
  const updateSelectedColumn = async (e, column, index, c) => {
    let cols = localStorage.getItem("columns");
    cols = JSON.parse(cols);
    cols[column] = index;
    let tempValues = Object.values(cols);
    if (tempValues.includes(index)) {
      let key = Object.keys(cols).find(
        (key) => cols[key] === index && key !== column
      );
      if (key !== undefined) {
        cols[key] = -1;
      }
    }

    // Check price column for numeric values
    let productsPrices = [];
    for (let i = 0; i < sheetData.length; i++) {
      if (
        (sheetData[i].cells[cols["Price"]] === undefined &&
          cols["Price"] !== -1) ||
        (sheetData[i].cells[cols["Name"]] === undefined && cols["Name"] !== -1)
      ) {
        continue;
      }
      productsPrices.push(parseFloat(sheetData[i].cells[cols["Price"]]));
    }

    productsPrices[0] = 0;
    if (cols["Price"] !== -1 && productsPrices.includes(NaN)) {
      handleAlert("error", "Price for all products must be a number.");
    }
    // Same column information
    setCol(cols);
    if (document.getElementById(`${c}-${index}`)) {
      document.getElementById(`${c}-${index}`).textContent = column;
    }
    localStorage.setItem("columns", JSON.stringify(cols));
  };

  const updateCurrencyColumn = async (e, country, currency) => {
    e.preventDefault();
    if (document.getElementById(`currency`)) {
      if (currency === "EUR") {
        document.getElementById(`currency`).textContent = currency;
      } else {
        document.getElementById(`currency`).textContent =
          country + " - " + currency;
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center">
        {!isMobile && (
          <Grid item xs={12} md={1}>
            <IconButton size="large" color="primary" onClick={cancelStore}>
              <ArrowBackIosIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        )}
        <Grid container item xs={12} md={11} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h2" sx={{ pb: 4, pt: 4, fontWeight: "light" }}>
              Create My Popstore
            </Typography>
          </Grid>
          <Grid
            container
            item
            spacing={2}
            xs={12}
            md={4}
            justifyContent={!isMobile && "flex-end"}
            alignItems="center"
            marginBottom={isMobile && "20px"}
          >
            <Grid item xs={8} md={10}>
              <Button
                color="primary"
                variant="contained"
                onClick={saveStore}
                sx={{ width: "80%" }}
              >
                Create PopStore
              </Button>
              {alert.type === "error" && (
                <ErrorAlert
                  open={openModal}
                  onClose={handleCloseModal}
                  message={alert.message}
                />
              )}
              {alert.type === "success" && (
                <SuccessAlert
                  open={openModal}
                  onClose={() => navigate("/")}
                  message={alert.message}
                  navigate={() => navigate("/")}
                />
              )}
            </Grid>
            <Grid item xs={4} md={2}>
              <Link href="#" onClick={cancelStore} sx={{ width: "100%" }}>
                Cancel
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <CreatePopstoreBox maxWidth="lg">
        <form onSubmit={saveStore}>
          <Grid container spacing={2} alignItems="center">
            <Grid item container spacing={2} xs={12} md={6}>
              <Grid item xs={12} md={6}>
                <div>
                  <Typography variant="body" color="text.main">
                    Store Name
                  </Typography>
                </div>
                <StyledTextField
                  fullWidth
                  id="outlined-basic"
                  label=""
                  helperText=""
                  variant="outlined"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  <Typography variant="body" color="text.main">
                    Contact
                  </Typography>
                </div>
                <StyledTextField
                  fullWidth
                  id="outlined-basic"
                  label=""
                  helperText=""
                  type="email"
                  variant="outlined"
                  value={storeOwner}
                  onChange={(e) => setStoreOwner(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <div>
                  <Typography variant="body" color="text.main">
                    Description
                  </Typography>
                </div>
                <StyledTextField
                  multiline
                  fullWidth
                  id="outlined-basic"
                  label=""
                  helperText=""
                  variant="outlined"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  inputProps={{
                    style: {
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" xs={12} md={6}>
              <Grid item width="50%">
                <div>
                  <Typography variant="body" color="text.main">
                    Currency
                  </Typography>
                </div>
                <Select
                  fullWidth={true}
                  label=""
                  value={storeCurrency}
                  onChange={updateCurrencyValue}
                  id="currency"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#fff",
                        "& .MuiMenuItem-root": {
                          padding: 2,
                        },
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid",
                      borderColor: "#353535",
                      borderRadius: "6px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover": {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                      "&:focused": {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {Object.keys(currencies).map((currency, i) => (
                    <MenuItem
                      key={`${i}`}
                      value={currencies[currency]}
                      onClick={(e) =>
                        updateCurrencyColumn(e, currency, currencies[currency])
                      }
                    >
                      {currency} - {currencies[currency]}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <div className="create-table-wrapper">
          <TableContainer
            sx={{
              backgroundColor: (theme) => theme.palette.background2,
              marginTop: "50px",
            }}
          >
            <Table style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: "2px solid",
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3),
                    "&:first-child": {
                      borderTop: "none",
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  {columns?.map((column, index) => (
                    <TableCell key={index}>
                      <Select
                        fullWidth={true}
                        id={`${column}-${index}`}
                        label=""
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: "#fff",
                              "& .MuiMenuItem-root": {
                                padding: 2,
                              },
                            },
                          },
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          getContentAnchorEl: null,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid",
                            borderColor: "#353535",
                            borderRadius: "6px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                            "&:focused": {
                              borderColor: (theme) =>
                                theme.palette.primary.main,
                            },
                          },
                        }}
                      >
                        {dbColumns.map((dbColumn, i) => (
                          <MenuItem
                            disabled={
                              col[dbColumn] !== -1 &&
                              dbColumn !== "Ignore" &&
                              col[dbColumn] !== index
                            }
                            onClick={(e) =>
                              updateSelectedColumn(e, dbColumn, index, column)
                            }
                            key={`${index}-${dbColumn}`}
                          >
                            {dbColumn}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sheetData?.map((row, rowIndex) => {
                  return (
                    <TableRow key={`row-${rowIndex}`}>
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell
                          key={`cell-${rowIndex}-${cellIndex}`}
                          className={styles["cell"]}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CreatePopstoreBox>
      <Grid
        container
        alignItems="center"
        marginTop={isMobile ? "10px" : "50px"}
        marginBottom={isMobile && "10px"}
      >
        <Grid item xs={12} md={8}>
          <p>&nbsp;</p>
        </Grid>
        <Grid
          item
          container
          spacing={2}
          xs={12}
          md={4}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs={8} md={10}>
            <Button
              color="primary"
              variant="contained"
              onClick={saveStore}
              sx={{ width: "80%" }}
            >
              Create PopStore
            </Button>
          </Grid>
          <Grid item xs={4} md={2}>
            <Link href="#" onClick={cancelStore} sx={{ width: "100%" }}>
              Cancel
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewPopstore;
