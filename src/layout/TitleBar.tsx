import { useEffect } from "react";

export default function TitleBar() {
  useEffect(() => {
    // só executar quando estiver rodando como app Tauri (desktop)
    if (typeof window !== "undefined" && (window as any).__TAURI_IPC__) {
      (async () => {
        const { Menu } = await import("@tauri-apps/api/menu");
        const menu = await Menu.new({
          items: [
            {
              id: "Open",
              text: "open",
              action: () => {
                console.log("open pressed");
              },
            },
            {
              id: "Close",
              text: "close",
              action: () => {
                console.log("close pressed");
              },
            },
          ],
        });

        await menu.setAsAppMenu();
      })();
    }
  }, []);

  return <div>TitleBar</div>;
}
