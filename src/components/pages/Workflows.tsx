import { useDatabaseManager } from "@/hooks/useDatabaseManager";
import { WorkFlowFile } from "@/lib/workflowManager";
import { ChevronDown, Download, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader } from "../ui/card";

function WorkflowsTab() {
  const { workFlowManager, database } = useDatabaseManager();
  const [workFlowFiles, setWorkFlowFiles] = useState<WorkFlowFile[]>();

  const LoadFiles = () => {
    workFlowManager?.listFiles().then((res) => {
      setWorkFlowFiles(res);
    });
  };

  useEffect(() => {
    LoadFiles();
  }, [workFlowManager]);

  return (
    <Card>
      <CardHeader>Workflows</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Download</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workFlowFiles?.map((workFlow, index) => (
              <TableRow key={index}>
                <TableCell>{workFlow.id}</TableCell>
                <TableCell>{workFlow.name}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        Download <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col items-stretch gap-2">
                      {database?.environments.map((env) => (
                        <div>
                          <Button
                            onClick={() => {
                              workFlowManager?.downloadWorkflow(
                                workFlow.filePath,
                                env.id
                              );
                            }}
                            className="w-full"
                          >
                            {env.name}
                            <Download />
                          </Button>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={async () => {
                      await workFlowManager?.deleteWorkFlow(workFlow.id);
                      LoadFiles();
                    }}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default WorkflowsTab;
