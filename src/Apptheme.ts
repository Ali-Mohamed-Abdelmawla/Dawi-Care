// AppTheme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    schedeuleTableCell: {
      main: string;
    };
    dividerColor: {
      main: string;
    };
  }
  interface PaletteOptions {
    schedeuleTableCell?: {
      main: string;
    };
    dividerColor?: {
      main: string;
    };
  }
}

let theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: [
      "Zain",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#0077b6", // Deep blue
      light: "#48cae4", // Vibrant light blue
      dark: "#03045e", // Dark blue
    },
    secondary: {
      main: "#0a766b", // Teal blue
      light: "#0EC4B2", // Light blue
      dark: "#044740", // Deep blue (for darker secondary shades)
    },
    error: {
      main: "#DC2F02",
    },
    warning: {
      main: "#F4A261",
    },
    success: {
      main: "#52B788",
    },
    info: {
      main: "#4cc9f0",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212529",
      secondary: "#495057",
    },
    schedeuleTableCell: {
      main: "#f5f5f5",
    },
    dividerColor: {
      main: "#dee2e6",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0077b6", // Use primary color
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 119, 182, 0.08)", // Adjusted to match theme colors
            "&:hover": {
              backgroundColor: "rgba(0, 119, 182, 0.12)",
            },
          },
        },
      },
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  shadows: [
    "none", // 0
    "0 1px 2px rgba(0,0,0,0.06)", // 1 - Very subtle shadow
    "0 2px 4px rgba(0,0,0,0.08)", // 2 - Light shadow
    "0 4px 6px rgba(0,0,0,0.1)", // 3 - Mild shadow
    "0 5px 10px rgba(0,0,0,0.12)", // 4 - Moderate shadow
    "0 6px 12px rgba(0,0,0,0.14)", // 5 - Slightly deeper shadow
    "0 10px 15px rgba(0,0,0,0.16)", // 6 - Noticeable elevation
    "0 12px 20px rgba(0,0,0,0.18)", // 7 - Significant elevation
    "0 14px 25px rgba(0,0,0,0.20)", // 8 - Strong elevation
    "0 16px 30px rgba(0,0,0,0.22)", // 9 - Very strong elevation
    "0 18px 35px rgba(0,0,0,0.24)", // 10 - Dramatic elevation
    "0 20px 40px rgba(0,0,0,0.26)", // 11 - Extreme elevation
    "0 22px 45px rgba(0,0,0,0.28)", // 12 - Maximal elevation
    "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)", // 13 - Layered subtle shadow
    "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)", // 14 - Layered moderate shadow
    "0 15px 25px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.12)", // 15 - Layered strong shadow
    "0 20px 40px rgba(0,0,0,0.25), 0 10px 15px rgba(0,0,0,0.15)", // 16 - Layered dramatic shadow
    "0 25px 50px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.2)", // 17 - Layered extreme shadow
    "0 30px 60px rgba(0,0,0,0.35), 0 20px 25px rgba(0,0,0,0.25)", // 18 - Maximal layered shadow
    "0 35px 70px rgba(0,0,0,0.4), 0 25px 30px rgba(0,0,0,0.3)", // 19 - Ultra dramatic shadow
    "0 40px 80px rgba(0,0,0,0.45), 0 30px 35px rgba(0,0,0,0.35)", // 20 - Extreme elevation
    "0 45px 90px rgba(0,0,0,0.5), 0 35px 40px rgba(0,0,0,0.4)", // 21 - Maximal elevated shadow
    "0 50px 100px rgba(0,0,0,0.55), 0 40px 45px rgba(0,0,0,0.45)", // 22 - Ultimate shadow
    "0 60px 120px rgba(0,0,0,0.6), 0 50px 55px rgba(0,0,0,0.5)", // 23 - Beyond elevation
    "0 70px 140px rgba(0,0,0,0.65), 0 60px 65px rgba(0,0,0,0.55)" // 24 - Extreme elevation
  ],
});

// making fonts responsive
theme = responsiveFontSizes(theme);

export default theme;
