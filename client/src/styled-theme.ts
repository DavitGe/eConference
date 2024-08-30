const lightTheme = {
  dividerColor: "#6c7173",
  bg: "#FFF",
  mainBgColor: "#fbf7ef",
};

const defaultTheme = {
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
  },
  borderRadius: {
    small: "5px",
    medium: "10px",
    large: "15px",
    circle: "50%",
  },
};
const theme = {
  light: {
    color: lightTheme,
    ...defaultTheme,
  },
};

export default theme;
