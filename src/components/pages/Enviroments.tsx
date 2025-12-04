import { useDatabaseManager } from "@/hooks/useDatabaseManager";
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
  const { manager, database } = useDatabaseManager();

  const [openAddEnv, setOpenaddEnv] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");

  const createEnvironment = () => {
    manager?.environmentManager?.create(newEnvName);
  };

  const deleteEnv = (envId: string) => {
    manager?.environmentManager?.deleteById(envId);
  };

  return (
    <>
      <Dialog onOpenChange={setOpenaddEnv} open={openAddEnv}>
        <DialogContent>
          <DialogHeader>Insert environment name</DialogHeader>
          <Input
            placeholder="DEV"
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
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {database?.environments?.map((item) => (
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
