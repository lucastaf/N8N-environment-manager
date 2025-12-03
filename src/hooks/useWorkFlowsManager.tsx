import { createContext, ReactNode, useCallback, useContext } from "react";
import { create, readFile } from "@tauri-apps/plugin-fs";
import { mkdir } from "@tauri-apps/plugin-fs";
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
        const jsonBody = JSON.parse(decodedContent);
        const fileName = jsonBody.name + ".json";
        const newFilePath = [selectedPath, "nodes", fileName].join("/");

        const folder = [selectedPath, "nodes"].join("/");
        await mkdir(folder, {
          recursive: true,
        });
        console.log(newFilePath);
        const newFile = await create(newFilePath);

        await newFile.write(content);
        await newFile.close();
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
