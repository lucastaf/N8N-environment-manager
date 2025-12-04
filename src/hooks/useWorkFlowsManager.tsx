import { databaseManager } from "@/components/database/workFlowsManager";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelectedPath } from "./useSelectedPath";
import { readFile } from "@tauri-apps/plugin-fs";
import { credentialsDatabaseType } from "@/components/database/databaseType";

type workFlowsManagerType = {
  manager: databaseManager | undefined;
  database: credentialsDatabaseType | undefined;
  addWorkFlowFromFilePath: (path: string) => void;
};
const WorkFlowManagerContext = createContext<workFlowsManagerType | undefined>(
  undefined
);

export const WorkFlowManagerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { selectedPath } = useSelectedPath();
  const [manager, setManger] = useState<databaseManager>();
  const [databaseData, setDataBaseData] = useState<credentialsDatabaseType>();
  useEffect(() => {
    if (selectedPath) {
      const newManager = new databaseManager(selectedPath, (newDatabase) => {
        setDataBaseData(newDatabase);
      });
      setManger(newManager);
      newManager.load();
    }
  }, [selectedPath]);

  const addWorkflowFromFilePath = useCallback(
    async (workflowFilePath: string) => {
      const content = await readFile(workflowFilePath);
      const decodedContent = new TextDecoder().decode(content);
      if (selectedPath) {
        const jsonBody = JSON.parse(decodedContent);
        manager?.addWorkFlow(jsonBody);
      }
    },
    [selectedPath]
  );
  return (
    <WorkFlowManagerContext.Provider
      value={{
        manager: manager,
        addWorkFlowFromFilePath: addWorkflowFromFilePath,
        database: databaseData,
      }}
    >
      {children}
    </WorkFlowManagerContext.Provider>
  );
};

export const useWorkFlowManager = () => {
  const ctx = useContext(WorkFlowManagerContext);
  if (!ctx) {
    throw new Error(
      "useWorkFlowManager must be used within a WorkFlowManagerProvider"
    );
  }
  return ctx;
};
