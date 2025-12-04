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

export default function EnviromentsTab() {
  const { manager, database } = useWorkFlowManager();

  const [openAddEnv, setOpenaddEnv] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");

  const createEnvironment = () => {
    manager?.enviromentManager?.createEnviroment(newEnvName);
  };

  const deleteEnv = (envId: string) => {
    manager?.enviromentManager?.deleteEnvById(envId);
  };

  return (
    <>
      <Dialog onOpenChange={setOpenaddEnv} open={openAddEnv}>
        <DialogContent>
          <DialogHeader>Insert environment name</DialogHeader>
          <Input
            value={newEnvName}
            onChange={(e) => setNewEnvName(e.target.value)}
          />
          <Button onClick={createEnvironment}> ADD Environment </Button>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>Enviroments</div>
            <Button onClick={() => setOpenaddEnv(true)}>Add Enviroment</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Action</TableHead>
            </TableHeader>
            <TableBody>
              {database?.enviroments.map((item) => (
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteEnv(item.id)}
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
