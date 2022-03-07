import React from "react";
import TextField from "@mui/material/TextField";

const FormTextField = ({ formik, name, ...rest }) => {
  return (
    <TextField
      name={name}
      variant="outlined"
      size="small"
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      {...rest}
    />
  );
};

export default FormTextField;
