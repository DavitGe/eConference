import { Form } from "antd";
import styled from "styled-components";

export const LoginPageWrapper = styled.main`
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
`;

export const LoginPageContainer = styled.div`
  padding: 64px 24px;
  form {
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.theme.color.bg};
    border: 1px solid ${({ theme }) => theme.theme.color.dividerColor};
    border-radius: 0.75rem;
    padding: 48px;
    width: 576px;
    h1 {
      font-size: 44px;
    }
    label {
      font-weight: 700;
      font-size: 14px;
    }
    input {
      height: 48px;
      margin-top: 8px;
    }
    a {
      text-decoration: underline;
    }
    button {
      height: 48px;
      margin-top: 48px;
    }
  }
`;
