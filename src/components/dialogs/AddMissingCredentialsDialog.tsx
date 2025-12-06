import { N8NFindedCredential } from "@/lib/workflowManager";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useDatabaseManager } from "@/hooks/useDatabaseManager";

export default function AddMissingCredentialsDialog(props: {
  open: boolean;
  setOpen: (state: boolean) => void;
  credentials: N8NFindedCredential[] | undefined;
}) {
  const { credentials, open, setOpen } = props;
  const { database, manager, workFlowManager } = useDatabaseManager();
  const [selectedValues, setSelectedValues] = useState<
    Record<
      string,
      {
        id_credential: string;
        id_environment: string;
      }
    >
  >({});

  const handleAddCredentials = useCallback(async () => {
    const selectedValuesEntries = Object.entries(selectedValues);
    for (const entry of selectedValuesEntries) {
      const [id, selectedValue] = entry;

      if (selectedValue.id_credential && selectedValue.id_environment) {
        const credential = credentials?.find((item) => item.id == id);
        if (!credential) return;

        await manager?.environmentCredentialMangaer.create({
          id: id,
          id_credential: selectedValue.id_credential,
          id_environment: selectedValue.id_environment,
          name: credential?.name,
          value: credential?.value,
        });
      }

      setOpen(false);
      workFlowManager?.retryWorkFlowAdd();
    }
  }, [database, selectedValues]);

  const getEnvironmentName = useCallback(
    (environment_id: string) => {
      return database?.environments.find((item) => item.id == environment_id)
        ?.name;
    },
    [database]
  );
  const getCredentialName = useCallback(
    (credential_id: string) => {
      return database?.credentials.find((item) => item.id == credential_id)
        ?.name;
    },
    [database]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Add Missing environment credentials</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Credential</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials?.map((credential, index) => (
              <TableRow key={index}>
                <TableCell>{credential.id}</TableCell>
                <TableCell>{credential.name}</TableCell>
                <TableCell>
                  <Select
                    value={selectedValues[credential.id]?.id_environment}
                    onValueChange={(selectedValue) => {
                      setSelectedValues((prev) => {
                        const prevSelection = prev[credential.id] ?? {};
                        prevSelection.id_environment = selectedValue;
                        prev[credential.id] = prevSelection;
                        return { ...prev };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {getEnvironmentName(
                          selectedValues[credential.id]?.id_environment
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {database?.environments.map((item) => (
                        <SelectItem value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {" "}
                  <Select
                    value={selectedValues[credential.id]?.id_credential}
                    onValueChange={(selectedValue) => {
                      setSelectedValues((prev) => {
                        const prevSelection = prev[credential.id] ?? {};
                        prevSelection.id_credential = selectedValue;
                        prev[credential.id] = prevSelection;
                        return { ...prev };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {getCredentialName(
                          selectedValues[credential.id]?.id_credential
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {database?.credentials.map((item) => (
                        <SelectItem value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleAddCredentials}>Add Credentials</Button>
      </DialogContent>
    </Dialog>
  );
}
