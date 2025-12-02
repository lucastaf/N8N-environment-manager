import { useWorkFlowManager } from "@/hooks/useWorkFlowsManager";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useEffect, useState } from "react";

function GlobalFileAdder() {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const workflowManager = useWorkFlowManager();
  useEffect(() => {
    if ((window as any)._dragDropRegistered) return;
    (window as any)._dragDropRegistered = true;
    let unlisten: (() => void) | null = null;

    const setup = async () => {
      unlisten = await getCurrentWebview().onDragDropEvent((event) => {
        if (event.payload.type === "over") {
          setIsHoverActive(true);
        } else if (event.payload.type === "drop") {
          setIsHoverActive(false);
          workflowManager?.addWorkFlow(event.payload.paths[0]);
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
  }, []);

  console.log(isHoverActive);
  if (isHoverActive)
    return (
      <div className="absolute w-full h-full bg-gray-500 opacity-50 flex items-center justify-center">
        Solte o arquivo para adicionar um workflow
      </div>
    );
  //   return <div>OLA</div>;
}

export default GlobalFileAdder;
