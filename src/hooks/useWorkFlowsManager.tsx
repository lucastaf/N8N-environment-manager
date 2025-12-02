import { createContext, ReactNode, useContext } from "react";

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
  return (
    <WorkFlowManagerContext.Provider
      value={{
        addWorkFlow(path) {
          console.log(path);
        },
      }}
    >
      {children}
    </WorkFlowManagerContext.Provider>
  );
};

export const useWorkFlowManager = () => useContext(WorkFlowManagerContext);
