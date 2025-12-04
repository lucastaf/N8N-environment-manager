import { WorkFlowManager } from "@/components/database/workFlowsManager";
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

type workFlowsManagerType = {
  manager: WorkFlowManager | undefined;
  addWorkFlow: (path: string) => void;
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
  const [manager, setManger] = useState<WorkFlowManager>();
  useEffect(() => {
    if (selectedPath) {
      setManger(new WorkFlowManager(selectedPath));
    }
  }, [selectedPath]);

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
        manager: manager,
        addWorkFlow: addWorkflow,
      }}
    >
      {children}
    </WorkFlowManagerContext.Provider>
  );
};

export const useWorkFlowManager = () => useContext(WorkFlowManagerContext);
