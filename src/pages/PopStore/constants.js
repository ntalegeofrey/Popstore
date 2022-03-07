import * as yup from "yup";

const validationSchema = yup.object({
  name: yup
    .string("Enter your name")
    .min(2)
    .max(256)
    .required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string("Enter your phone")
    .min(10, "Phone should be of minimum 10 characters length")
    .max(15, "Phone should be of maximum 15 characters length")
    .required("Phone is required"),
});
export { validationSchema };
