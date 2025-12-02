import { Button } from "@/components/ui/button";
import N8NLogo from "../assets/n8n.svg";
import { useSelectedPath } from "@/hooks/useSelectedPath";
import { open } from "@tauri-apps/plugin-dialog";

export function Header() {
  const selectedPath = useSelectedPath();
  return (
    <div className="flex items-center">
      <img src={N8NLogo} className="p-2 size-20" alt="Vite logo" />
      <div className="pl-4">N8N Environment manager</div>

      <div>
        <Button
          onClick={async () => {
            const file = await open({
              multiple: false,
              directory: true,
            });
            if (file != null) {
              selectedPath.setSelectedPath(file);
            }
          }}
        >
          Selecionar pasta
        </Button>
        {selectedPath.selectedPath}
      </div>
    </div>
  );
}
