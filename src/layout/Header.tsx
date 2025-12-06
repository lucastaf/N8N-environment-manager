import { Button } from "@/components/ui/button";
import N8NLogo from "../assets/n8n.svg";
import { useSelectedPath } from "@/hooks/useSelectedPath";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { Folder } from "lucide-react";

export function Header() {
  const selectedPath = useSelectedPath();
  return (
    <div className="flex items-center justify-between mx-4">
      <div className="flex items-center">
        <img src={N8NLogo} className="p-2 size-20" alt="Vite logo" />
        <div className="pl-4">N8N Environment manager</div>
      </div>

      <div className="flex flex-col items-end my-4">
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const path = await open({
                multiple: false,
                directory: true,
                canCreateDirectories: false,
              });

              const correctedPath = path?.replace(/\\/g, "/");

              if (correctedPath != null) {
                selectedPath.setSelectedPath(correctedPath);
              }
            }}
          >
            Select Folder
          </Button>
          <Button
            onClick={() =>
              selectedPath.selectedPath && openPath(selectedPath.selectedPath)
            }
          >
            <Folder />
          </Button>
        </div>
        <div>{selectedPath.selectedPath}</div>
      </div>
    </div>
  );
}
