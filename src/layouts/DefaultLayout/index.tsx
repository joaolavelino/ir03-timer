import { Outlet } from "react-router-dom";
import { LayoutContainer } from "./styles";
import { Header } from "../../components/Header";

interface LayoutProps {
  theme: string;
  toggleTheme: () => void;
}
export function DefaultLayout({ theme, toggleTheme }: LayoutProps) {
  return (
    <LayoutContainer>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Outlet />
    </LayoutContainer>
  );
}
