import { useDatabaseManager } from "@/hooks/useDatabaseManager";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useEffect, useState } from "react";

function GlobalFileAdder() {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const { workFlowManager } = useDatabaseManager();

  useEffect(() => {
    if ((window as any)._dragDropRegistered) return;
    let unlisten: (() => void) | null = null;

    const setup = async () => {
      if (!workFlowManager) return;
      (window as any)._dragDropRegistered = true;
      unlisten = await getCurrentWebview().onDragDropEvent((event) => {
        if (event.payload.type === "over") {
          setIsHoverActive(true);
        } else if (event.payload.type === "drop") {
          setIsHoverActive(false);
          workFlowManager?.addWorkFlowFromFile(event.payload.paths[0]);
        } else {
          setIsHoverActive(false);
        }
      });
    };

    setup();

    return () => {
      if (unlisten) {
        unlisten();
        console.log("DragDrop listener removido");
      }
    };
  }, [workFlowManager]);

  if (isHoverActive)
    return (
      <div className="absolute w-full h-full bg-gray-500 opacity-50 flex items-center justify-center">
        Realese the mouse to add the workflow
      </div>
    );
  //   return <div>OLA</div>;
}

export default GlobalFileAdder;
