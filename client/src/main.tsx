import * as React from "react";
import * as ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "styled-components";
import theme from "./styled-theme";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={{ theme: theme.light }}>
      <ConfigProvider
        theme={{
          token: {
            colorBorder: theme.light.color.dividerColor,
            fontFamily: "Roobert PRO",
            colorText: "#1c1c1e",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);
