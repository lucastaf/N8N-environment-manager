import { useDatabaseManager } from "@/hooks/useDatabaseManager";
import { WorkFlowFile } from "@/lib/workflowManager";
import { ChevronDown, Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
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

function WorkflowsTab() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const { workFlowManager, database } = useDatabaseManager();
  const [workFlowFiles, setWorkFlowFiles] = useState<WorkFlowFile[]>();

  useEffect(() => {
    workFlowManager?.listFiles().then((res) => {
      setWorkFlowFiles(res);
    });
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Download</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default WorkflowsTab;
