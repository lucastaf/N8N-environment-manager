import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { useDatabaseManager } from "@/hooks/useDatabaseManager";

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
      <Button
        onClick={() => {
          workFlowManager?.listFiles().then((res) => {
            workFlowManager.downloadWorkflow(
              res[0].filePath,
              database?.environments[0].id
            );
            console.log(res);
          });
        }}
      />
    </div>
  );
}

export default WorkflowsTab;
