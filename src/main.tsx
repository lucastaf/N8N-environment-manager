import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./layout/TitleBar.tsx";
import { Header } from "./layout/Header.tsx";
import { SelectedPathProvider } from "./hooks/useSelectedPath.tsx";
import { WorkFlowManagerProvider } from "./hooks/useWorkFlowsManager.tsx";
import GlobalFileAdder from "./layout/GlobalFileAdder.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SelectedPathProvider>
      <WorkFlowManagerProvider>
        <Header />
        <GlobalFileAdder />
        <App />
      </WorkFlowManagerProvider>
    </SelectedPathProvider>
  </React.StrictMode>
);
