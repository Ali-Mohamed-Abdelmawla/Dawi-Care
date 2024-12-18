import { useState, useEffect } from "react";
import Routing from "./Routing";
import { ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline } from "@mui/material";
import theme from "./Apptheme";
import ErrorBoundary from "./ErrorBoundary";
import "dayjs/locale/ar"; // to make it effective globally

function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Zain"').then(() => {
      console.log("Zain font has loaded.");
      setFontLoaded(true);
    });
  }, []);

  if (!fontLoaded) {
    return <div>Loading...</div>;
  }

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
  });
  function RTL(props: { children: React.ReactNode }) {
    return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
  }

  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </ThemeProvider>
    </RTL>
  );
}

export default App;
