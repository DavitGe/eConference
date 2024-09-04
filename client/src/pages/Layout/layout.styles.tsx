import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 32px;
  height: 72px;
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 6px;
    li {
      margin-inline: 20px;
      a {
        text-decoration: none;
        color: ${({ theme }) => theme.theme.color.textColor};
        font-weight: 500;
        font-size: 16px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;
