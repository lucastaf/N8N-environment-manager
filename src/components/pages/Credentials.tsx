import { useWorkFlowManager } from "@/hooks/useWorkFlowsManager";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function CredentialsTab() {
  const { manager, database } = useWorkFlowManager();

  const [openAddCredential, setOpenaddCredential] = useState(false);
  const [newCredentialName, setNewCredentialName] = useState("");

  const createEnvironment = () => {
    manager?.credentialsManager?.createCredential(newCredentialName);
  };

  const deleteCredential = (envId: string) => {
    manager?.credentialsManager?.deleteCredentialById(envId);
  };

  return (
    <>
      <Dialog onOpenChange={setOpenaddCredential} open={openAddCredential}>
        <DialogContent>
          <DialogHeader>Insert credential name</DialogHeader>
          <Input
            placeholder="MySql Connection"
            value={newCredentialName}
            onChange={(e) => setNewCredentialName(e.target.value)}
          />
          <Button onClick={createEnvironment}> ADD Environment </Button>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>Credentials</div>
            <Button onClick={() => setOpenaddCredential(true)}>
              Add Enviroment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {database?.credentials.map((item) => (
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteCredential(item.id)}
                      variant={"destructive"}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
