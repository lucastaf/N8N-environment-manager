import { credentialsDatabaseType } from "@/lib/database/databaseType";
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
import { useState } from "react";

export default function AddMissingCredentialsDialog(props: {
  open: boolean;
  setOpen: (state: boolean) => void;
  credentials: N8NFindedCredential[] | undefined;
  database: credentialsDatabaseType;
}) {
  const { credentials, open, setOpen, database } = props;
  const [selectedValues, setSelectedValues] = useState<
    Record<
      string,
      {
        id_credential: string;
        id_environment: string;
      }
    >
  >({});

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
                        console.log(selectedValue);
                        const prevSelection = prev[credential.id] ?? {};
                        prevSelection.id_environment = selectedValue;
                        prev[credential.id] = prevSelection;
                        return { ...prev };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {database.environments.map((item) => (
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
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {database.credentials.map((item) => (
                        <SelectItem value={item.id}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
