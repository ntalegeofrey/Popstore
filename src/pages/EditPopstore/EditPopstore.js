import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "@mui/material/Link";
import { useNavigate, useParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import firebase, {
  db,
  doc,
  updateDoc,
  collection,
  getDoc,
} from "../../service/firebase";
import {
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import styles from "../../components/DataTable/Sheets.module.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loading from "../../components/Loading";
import isEmail from "validator/lib/isEmail";
import { StyledTextField } from "../../components/Styles/styledTextField";
import {
  eurocurrencies,
  updateCurrencyColumn,
} from "../NewPopstore/NewPopstore";
import { deleteDoc } from "@firebase/firestore";

const EditPopstore = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [dbColumns] = useState(["Reference ID", "Name", "Price"]);
  const [loading, setLoading] = useState(true);
  const [stre, setstrefRef] = useState(true);
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const storesRef = await collection(
          db,
          `/StoreOwners/${user.uid}/allStores`
        );
        const store = await getDoc(doc(storesRef, storeId));
        if (store.exists()) {
          let data = store.data();
          data.columnsList = JSON.parse(data.columnsList);
          setStore(data);
          setLoading(false);
          setstrefRef(storesRef);
        }
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
    });
    console.log("store: ", store);
  }, [navigate, storeId]);

  const updateStore = async (e) => {
    e.preventDefault();

    if (store.storeName.trim() === "") {
      await MySwal.fire({
        title: "Error!",
        text: "Please select a name for PopStore",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (!isEmail(store.storeOwner) || store.storeOwner.trim() === "") {
      await MySwal.fire({
        title: "Error!",
        text: "Please add an email for PopStore owner",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (store.description.trim() === "") {
      await MySwal.fire({
        title: "Error!",
        text: "Please add description for PopStore",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    let updatedStore = {
      storeName: store.storeName,
      storeOwner: store.storeOwner,
      description: store.description,
      locked: store.locked,
      currency: store.currency,
    };

    const storesRef = await collection(
      db,
      `/StoreOwners/${user.uid}/allStores`
    );
    const storeRef = await doc(storesRef, storeId);

    await updateDoc(storeRef, updatedStore);

    await MySwal.fire({
      title: "Success!",
      text: "PopStore updated successfully",
      icon: "success",
      confirmButtonText: "Ok",
    });
    localStorage.removeItem("columns");
    navigate("/");
  };

  const cancelStore = async (e) => {
    e.preventDefault();
    localStorage.removeItem("columns");
    navigate("/");
  };

  const handleCopy = (link) => {
    const url = `${window.location.origin}${link}`;
    // Copy the URL to the clipboard
    navigator.clipboard.writeText(url);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(stre, storeId));
      MySwal.fire({
        title: "Success!",
        text: "PopStore updated successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
      localStorage.removeItem("columns");
      navigate("/popstore/all");
    } catch (error) {
      console.log("Error deleting store:", error);
      // Handle the error condition here, if necessary
    }
  };

  if (loading) return <Loading />;
  return (
    <Container maxWidth="lg">
      {/* Top Container */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          &nbsp;
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            startIcon={<CopyAllIcon />}
            sx={{ border: "1px solid", width: "100%" }}
            onClick={() => handleCopy(`/store/${user.uid}/${storeId}`)}
          >
            Copy Link
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ border: "1px solid", width: "100%" }}
          >
            Download
          </Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={updateStore}
          >
            Update
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Link href="#" sx={{ width: "100%" }} onClick={cancelStore}>
            Cancel
          </Link>
        </Grid>
      </Grid>

      {/* Second Container */}
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid container item xs={12} md={6} spacing={2}>
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
              value={store.storeName}
              onChange={(e) =>
                setStore({ ...store, storeName: e.target.value })
              }
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
              value={store.storeOwner}
              onChange={(e) =>
                setStore({ ...store, storeOwner: e.target.value })
              }
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={6}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="body" color="text.main">
            Store Locked:
          </Typography>
          <Switch
            checked={store.locked}
            onChange={(e) => setStore({ ...store, locked: e.target.checked })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
            value={store.description}
            onChange={(e) =>
              setStore({ ...store, description: e.target.value })
            }
            inputProps={{
              style: {
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              },
            }}
          />
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
              value={store.currency}
              onChange={(e) => setStore({ ...store, currency: e.target.value })}
              id="currency"
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#fff",
                    maxHeight: "200px",
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
              {Object.keys(eurocurrencies).map((currency, i) => (
                <MenuItem
                  key={`${i}`}
                  value={eurocurrencies[currency]}
                  onClick={(e) =>
                    updateCurrencyColumn(e, currency, eurocurrencies[currency])
                  }
                >
                  {currency} - {eurocurrencies[currency]}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Grid>
      {/* Third Container */}
      {/* Fourth Container */}

      <div className="create-table-wrapper">
        <TableContainer
          sx={{ backgroundColor: (theme) => theme.palette.background2 }}
        >
          <Table style={{ tableLayout: "fixed" }}>
            <TableHead
              sx={{ background: (theme) => theme.palette.primary.main }}
            >
              <TableRow>
                {dbColumns?.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{ color: (theme) => theme.palette.white.main }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {store.columnsList?.map((row, rowIndex) => {
                return (
                  <TableRow
                    key={`row-${rowIndex}`}
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
                    {row.map((cell, cellIndex) =>
                      cellIndex !== 3 ? (
                        <TableCell
                          key={`cell-${rowIndex}-${cellIndex}`}
                          className={styles["cell"]}
                        >
                          {cell}
                        </TableCell>
                      ) : (
                        ""
                      )
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Grid container xs={12} md={12} justifyContent="flex-end" marginTop={3}>
        <Button
          variant="text"
          startIcon={<DeleteOutlineIcon />}
          sx={{
            border: "1px solid",
            width: "100%",
            color: "red",
            width: isMobile ? "100%" : "20%",
          }}
          onClick={handleDelete}
        >
          Delete Popstore
        </Button>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            backgroundColor: "#656f71",
            color: "#FFF",
            "& .MuiAlert-icon": {
              color: "#FFF",
            },
          }}
        >
          Link Copied!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default EditPopstore;
