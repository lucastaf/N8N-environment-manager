import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Table, TableHead, TableHeader } from "../ui/table";
import { Dialog, DialogContent } from "../ui/dialog";

export default function EnviromentsTab() {
  const [openAddEnv, setOpenaddEnv] = useState(false);
  return (
    <>
      <Dialog onOpenChange={setOpenaddEnv} open={openAddEnv}>
        <DialogContent>asd</DialogContent>
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
              <TableHead>Nome</TableHead>
            </TableHeader>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
