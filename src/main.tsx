import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./layout/TitleBar.tsx";
import { Header } from "./layout/Header.tsx";
import { SelectedPathProvider } from "./hooks/useSelectedPath.tsx";
import { DatabaseManagerProvider } from "./hooks/useDatabaseManager.tsx";
import GlobalFileAdder from "./layout/GlobalFileAdder.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SelectedPathProvider>
      <DatabaseManagerProvider>
        <Toaster />
        <Header />
        <GlobalFileAdder />
        <App />
      </DatabaseManagerProvider>
    </SelectedPathProvider>
  </React.StrictMode>
);
