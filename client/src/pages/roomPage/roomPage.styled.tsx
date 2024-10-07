import styled from "styled-components";

export const RoomPageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.theme.roomColors.bg};
  color: ${(props) => props.theme.theme.roomColors.textColor};
`;

export const RoomPageHeader = styled.div`
  height: 92px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 24px;
  border-bottom: 1px solid ${(props) => props.theme.theme.roomColors.border};
  .header-content {
    display: flex;
    align-items: center;
    h3 {
      margin-left: 32px;
    }
    span {
      background-color: ${(props) =>
        props.theme.theme.roomColors.containerColor};
      width: 84px;
      height: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
    }
  }
`;
