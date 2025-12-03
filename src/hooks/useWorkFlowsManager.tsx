import { WorkFlowManager } from "@/components/services/workFlowsManager";
import { readFile } from "@tauri-apps/plugin-fs";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { useSelectedPath } from "./useSelectedPath";

type workFlowsManagerType = {
  addWorkFlow(path: string): void;
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

  const addWorkflow = useCallback(
    async (workflowFilePath: string) => {
      const content = await readFile(workflowFilePath);
      const decodedContent = new TextDecoder().decode(content);
      if (selectedPath) {
        const workFlowManager = new WorkFlowManager(selectedPath);
        const jsonBody = JSON.parse(decodedContent);
        workFlowManager.addWorkFlow(jsonBody);
      }
    },
    [selectedPath]
  );

  return (
    <WorkFlowManagerContext.Provider
      value={{
        addWorkFlow: addWorkflow,
      }}
    >
      {children}
    </WorkFlowManagerContext.Provider>
  );
};

export const useWorkFlowManager = () => useContext(WorkFlowManagerContext);
