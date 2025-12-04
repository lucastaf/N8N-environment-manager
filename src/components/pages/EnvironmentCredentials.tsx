import { mergedEnvironmentsCredentials } from "@/lib/database/models/environmentCredentialsManager";
import { useDatabaseManager } from "@/hooks/useDatabaseManager";
import { Trash2 } from "lucide-react";
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

export default function EnviromentsCredentialsTab() {
  const { manager, database } = useDatabaseManager();

  const [mergedCredentials, setMergedCredentials] =
    useState<mergedEnvironmentsCredentials>();

  useEffect(() => {
    manager?.environmentCredentialMangaer.getMergedList().then((res) => {
      setMergedCredentials(res);
    });
  }, [database]);

  const deleteEnvironmentCredential = (credentialId: string) => {
    manager?.environmentCredentialMangaer.deleteById(credentialId);
  };

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
                      onClick={() => deleteEnvironmentCredential(item.id)}
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
