import { useWorkFlowManager } from "@/hooks/useWorkFlowsManager";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { mergedEnvironmentsCredentials } from "@/database/models/environmentCredentialsManager";

export default function EnviromentsCredentialsTab() {
  const { manager, database } = useWorkFlowManager();

  const [mergedCredentials, setMergedCredentials] =
    useState<mergedEnvironmentsCredentials>();

  useEffect(() => {
    manager?.environmentCredentialMangaer.getMergedList().then((res) => {
      setMergedCredentials(res);
    });
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>Enviroments</div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Credential</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mergedCredentials?.map((item) => (
                <TableRow>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.credential?.name}</TableCell>
                  <TableCell>{item.environment?.name}</TableCell>
                  <TableCell>
                    <Button
                      // onClick={() => deleteEnv(item.id)}
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
