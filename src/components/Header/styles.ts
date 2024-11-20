import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    a {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;

      color: ${(props) => props.theme["gray-100"]};
      border-top: 3px solid transparent;
      transition: 0.3s;

      &:hover {
        color: ${(props) => props.theme["green-300"]};
        border-color: ${(props) => props.theme["green-300"]};
      }
      &.active {
        color: ${(props) => props.theme["green-300"]};
      }
    }

    button {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme["gray-100"]};
      border: none;
      transition: 0.3s;
      background-color: transparent;

      &:hover {
        color: ${(props) => props.theme["green-300"]};
      }
    }
  }
`;
