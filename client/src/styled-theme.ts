const lightTheme = {
  primary: "#1777ff",
  dividerColor: "#6c7173",
  bg: "#FFF",
  mainBgColor: "#fbf7ef",
  textColor: "#1c1c1e",
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
  roomColors: {
    bg: "#1b1a1d",
    textColor: "#ebeaea",
    containerColor: "#2b2d2e",
    border: "#484849",
  },
};

const theme = {
  light: {
    color: lightTheme,
    ...defaultTheme,
  },
};

export default theme;
