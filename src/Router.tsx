import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { History } from "./pages/History";
import { DefaultLayout } from "./layouts/DefaultLayout";

interface RouterProps {
  theme: string;
  toggleTheme: () => void;
}

export function Router({ theme, toggleTheme }: RouterProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={<DefaultLayout theme={theme} toggleTheme={toggleTheme} />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}
