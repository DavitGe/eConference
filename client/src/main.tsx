import * as React from "react";
import * as ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "styled-components";
import theme from "./styled-theme";
import { ConfigProvider } from "antd";
import { CookiesProvider } from "react-cookie";
import { SocketProvider } from "./context/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={{ theme: theme.light }}>
      <ConfigProvider
        theme={{
          token: {
            colorBorder: theme.light.color.dividerColor,
            fontFamily: "Roobert PRO",
            colorText: theme.light.color.textColor,
            colorPrimary: theme.light.color.primary,
          },
        }}
      >
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <SocketProvider>
            <App />
          </SocketProvider>
        </CookiesProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);
