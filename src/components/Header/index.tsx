import { ListChecks, Moon, Sun, Timer } from "phosphor-react";
import igniteLogo from "../../assets/ignite-logo.svg";
import { HeaderContainer } from "./styles";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <HeaderContainer>
      <img src={igniteLogo} alt="" />
      <nav>
        <NavLink to="/" title="timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="histórico">
          <ListChecks size={24} />
        </NavLink>
        <button onClick={toggleTheme}>
          {theme == "default" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </nav>
    </HeaderContainer>
  );
}
