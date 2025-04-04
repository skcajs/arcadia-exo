import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#222222",
    },
    secondary: {
      main: "#6F4A7D",
    },
    background: {
      default: "#ebebf0",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6F4A7D",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#6F4A7D",
          "&.Mui-focused": {
            color: "#6F4A7D",
          },
        },
      },
    },
  },
});
