import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { useWorkFlowManager } from "@/hooks/useWorkFlowsManager";
import { enviroment } from "../database/databaseType";

export default function EnviromentsTab() {
  const workFlowManager = useWorkFlowManager();

  const [openAddEnv, setOpenaddEnv] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");

  const [enviromentsList, setEnviromentsList] = useState<enviroment[]>();

  useEffect(() => {
    workFlowManager?.manager?.getDB().then((res) => {
      setEnviromentsList(res.data.enviroments);
    });
  }, [workFlowManager]);

  const createEnvironment = async () => {
    await workFlowManager?.manager?.createEnviroment(newEnvName);
  };
  return (
    <>
      <Dialog onOpenChange={setOpenaddEnv} open={openAddEnv}>
        <DialogHeader>Insert environment name</DialogHeader>
        <DialogContent>
          <Input
            value={newEnvName}
            onChange={(e) => setNewEnvName(e.target.value)}
          />
          <Button onClick={createEnvironment} />
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
              <TableHead>Nome</TableHead>
            </TableHeader>
            <TableBody>
              {enviromentsList?.map((item) => (
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
