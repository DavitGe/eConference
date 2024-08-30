import styled from "styled-components";

export const LayoutContainer = styled.div`
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.theme.color.dividerColor};
  background-color: ${({ theme }) => theme.theme.color.bg};
  padding-inline: 89px;
`;
