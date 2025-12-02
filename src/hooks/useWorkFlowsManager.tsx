import { createContext, ReactNode, useContext } from "react";
import { BaseDirectory, create, readFile } from "@tauri-apps/plugin-fs";
import { useSelectedPath } from "./useSelectedPath";
import * as path from "@tauri-apps/api/path";

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
  const selectedPath = useSelectedPath();
  return (
    <WorkFlowManagerContext.Provider
      value={{
        async addWorkFlow(workflowFilePath: string) {
          const content = await readFile(workflowFilePath);
          const decodedContent = new TextDecoder().decode(content);
          console.log(decodedContent);
          if (selectedPath.selectedPath) {
            const jsonBody = JSON.parse(decodedContent);
            const fileName = jsonBody.name + ".json";
            const newFilePath = await path.join(
              selectedPath.selectedPath,
              "nodes",
              fileName
            );

            console.log(newFilePath);
            const newFile = await create(newFilePath);

            await newFile.write(content);
            await newFile.close();
          }
        },
      }}
    >
      {children}
    </WorkFlowManagerContext.Provider>
  );
};

export const useWorkFlowManager = () => useContext(WorkFlowManagerContext);
