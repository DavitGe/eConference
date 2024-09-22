import styled from "styled-components";

export const ProtectedWrapper = styled.form`
  display: flex;
  padding-inline: 124px;
  width: 100%;
  justify-content: space-between;
  div {
    margin-top: 124px;
    h1 {
      font-size: 64px;
      font-weight: 500;
      max-width: 712px;
      span {
        color: #0077ff;
      }
    }
    p {
      font-size: 18px;
      font-weight: 400;
      color: #6c6c6c;
    }
  }
  img {
    margin-top: 64px;
    width: 100%;
    height: 100%;
    max-width: 712px;
  }
`;
