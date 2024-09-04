import styled from "styled-components";

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
  h2 {
    font-size: 80px;
    letter-spacing: -0.56px;
    font-weight: 500;
    margin-top: 2rem;
    max-width: 1264px;
    text-align: center;
    span {
      font-weight: 500;
      color: ${(props) => props.theme.theme.color.primary};
    }
  }
  p {
    font-size: 18px;
  }
  button {
    height: 64px;
    font-size: 24px;
    width: 264px;
    margin-top: 48px;
  }
`;
