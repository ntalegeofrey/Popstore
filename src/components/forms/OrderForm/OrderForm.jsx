import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormTextField from "../FormTextField";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

const InputContainer = styled(Box)({});

const OrderForm = ({ formik }) => {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: "flex",
          justifyContent: !matches ? "space-between" : "flex-start",
          alignItems: "center",
        }}
        mt={5}
      >
        <Typography mr={2}>Name:</Typography>
        <FormTextField name="name" placeholder="John Sharpe" formik={formik} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: !matches ? "space-between" : "flex-start",
          alignItems: "center",
        }}
        mt={2}
      >
        <Typography mr={2}>E-mail:</Typography>
        <FormTextField
          name="email"
          placeholder="mail@example.com"
          formik={formik}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: !matches ? "space-between" : "flex-start",
          alignItems: "center",
        }}
        mt={2}
      >
        <Typography mr={2}>Phone:</Typography>
        <FormTextField
          name="phone"
          placeholder="+233500008880"
          formik={formik}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        mt={3}
      >
        <Button type="submit" variant="contained">
          Order
        </Button>
      </Box>
    </form>
  );
};

export default OrderForm;
