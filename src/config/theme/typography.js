import colors from "./colors";
const { dark } = colors;

const typography = {
  htmlFontSize: 16,
  fontFamily: "Open Sans, sans-serif",
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontWeight: 400,
    fontSize: "2.375rem",
    lineHeight: 1.21,
    color: dark.main,
  },
  h2: {
    fontWeight: 300,
    fontSize: "32px",
    lineHeight: 1.27,
    color: dark.main,
  },
  h3: {
    fontWeight: 300,
    fontSize: "1.3rem",
    lineHeight: 1.33,
    color: dark.main,
  },
  h4: {
    fontWeight: 300,
    fontSize: "1.15rem",
    lineHeight: 1.4,
    color: dark.main,
  },
  h5: {
    fontWeight: 300,
    fontSize: "1rem",
    lineHeight: 1.25,
    color: dark.main,
  },
  h6: {
    fontWeight: 300,
    fontSize: "0.93rem",
    lineHeight: 1.75,
    color: dark.main,
  },
  caption: {
    fontWeight: 300,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    color: dark.main,
  },
  body: {
    fontWeight: 300,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: dark.main,
  },
  body1: {
    fontWeight: 300,
    fontSize: "14px",
    lineHeight: 1.57,
    color: dark.main,
  },
  body2: {
    fontSize: "0.75rem",
    lineHeight: 1.66,
    color: dark.main,
  },
  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 300,
    lineHeight: 1.57,
    color: dark.main,
  },
  subtitle2: {
    fontSize: "0.75rem",
    fontWeight: 300,
    lineHeight: 1.3,
    color: dark.main,
  },
  footnote: {
    fontSize: "0.55rem",
    fontWeight: 300,
    lineHeight: 1.3,
    color: dark.main,
  },
  overline: {
    lineHeight: 1.66,
  },
  button: {
    textTransform: "none",
  },
};

export default typography;
