import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { useState } from "react";
import { lightTheme } from "./styles/themes/light";
import { Moon, Sun } from "phosphor-react";

export function App() {
  const [theme, setTheme] = useState<"default" | "light">("default");

  const currentTheme = theme == "default" ? defaultTheme : lightTheme;

  function toggleTheme() {
    setTheme((state) => (state == "default" ? "light" : "default"));
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <button onClick={toggleTheme}>
        {theme == "default" ? <Moon /> : <Sun />}
      </button>
      <p>Hello</p>
    </ThemeProvider>
  );
}
