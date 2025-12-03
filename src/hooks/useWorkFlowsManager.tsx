import { createContext, ReactNode, useCallback, useContext } from "react";
import { create, readFile } from "@tauri-apps/plugin-fs";
import { mkdir } from "@tauri-apps/plugin-fs";
import { useSelectedPath } from "./useSelectedPath";
import toast from "react-hot-toast";

type workFlowsManagerType = {
  addWorkFlow(path: string): void;
};

type N8NCredential = Record<string, { id: string; name: string }>;

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
        const newJsonContect = replaceCredentials(jsonBody);

        const fileName = jsonBody.name + ".json";
        const newFilePath = [selectedPath, "nodes", fileName].join("/");
        const folder = [selectedPath, "nodes"].join("/");
        await mkdir(folder, {
          recursive: true,
        });
        const newFile = await create(newFilePath);

        await newFile.write(content);
        await newFile.close();
      }
    },
    [selectedPath]
  );

  const replaceCredentials = (json: any) => {
    try {
      const credentials: N8NCredential[] = json.nodes
        .map((item: any) => item.credentials)
        .filter((item: any) => item !== undefined);

      const findedCredentials: N8NCredential = {};
      credentials.forEach((item: N8NCredential) => {
        Object.entries(item).forEach(([key, value]) => {
          findedCredentials[key] = value;
        });
      });
      console.log(findedCredentials);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao parsear json");
    }
  };

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
