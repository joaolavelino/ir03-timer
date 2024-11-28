import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Router } from "./Router";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";
import { lightTheme } from "./styles/themes/light";
import { CyclesContextProvider } from "./contexts/CyclesContext";

export function App() {
  const [theme, setTheme] = useState<"default" | "light">("default");

  const currentTheme = theme == "default" ? defaultTheme : lightTheme;

  function toggleTheme() {
    setTheme((state) => (state == "default" ? "light" : "default"));
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router theme={theme} toggleTheme={toggleTheme} />
        </CyclesContextProvider>
      </BrowserRouter>

      <GlobalStyle />
    </ThemeProvider>
  );
}
