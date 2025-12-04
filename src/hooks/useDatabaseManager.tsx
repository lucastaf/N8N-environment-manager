import { DatabaseManager } from "@/lib/database/databaseManager";
import { credentialsDatabaseType } from "@/lib/database/databaseType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelectedPath } from "./useSelectedPath";
import { N8NFindedCredential, WorkflowManager } from "@/lib/workflowManager";
import AddMissingCredentialsDialog from "@/components/dialogs/AddMissingCredentialsDialog";

type useDatabaseManagerType = {
  manager: DatabaseManager | undefined;
  database: credentialsDatabaseType | undefined;
  workFlowManager: WorkflowManager | undefined;
};
const DatabaseManagerContext = createContext<
  useDatabaseManagerType | undefined
>(undefined);

export const DatabaseManagerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { selectedPath } = useSelectedPath();
  const [manager, setManger] = useState<DatabaseManager>();
  const [databaseData, setDataBaseData] = useState<credentialsDatabaseType>();
  const [workFlowManager, setWorkFlowManager] = useState<WorkflowManager>();

  const [openAddMissingCredentialsDialog, setOpenMissingCredentialsDialog] =
    useState(false);
  const [missingCredentials, setMissingCredentials] =
    useState<N8NFindedCredential[]>();

  useEffect(() => {
    if (selectedPath) {
      const newManager = new DatabaseManager(selectedPath, (newDatabase) => {
        setDataBaseData(newDatabase);
      });
      setManger(newManager);
      newManager.load();
      setWorkFlowManager(
        new WorkflowManager(newManager, selectedPath, (missingCredentials) => {
          setMissingCredentials(missingCredentials);
          setOpenMissingCredentialsDialog(true);
        })
      );
    }
  }, [selectedPath]);

  return (
    <DatabaseManagerContext.Provider
      value={{
        manager: manager,
        database: databaseData,
        workFlowManager: workFlowManager,
      }}
    >
      <AddMissingCredentialsDialog
        open={openAddMissingCredentialsDialog}
        setOpen={setOpenMissingCredentialsDialog}
        credentials={missingCredentials}
        database={databaseData!}
      />
      {children}
    </DatabaseManagerContext.Provider>
  );
};

export const useDatabaseManager = () => {
  const ctx = useContext(DatabaseManagerContext);
  if (!ctx) {
    throw new Error(
      "useWorkFlowManager must be used within a WorkFlowManagerProvider"
    );
  }
  return ctx;
};
