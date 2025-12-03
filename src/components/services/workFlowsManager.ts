import { create, mkdir } from "@tauri-apps/plugin-fs";
import toast from "react-hot-toast";
import { credentialsDatabaseType } from "./databaseType";
import { TauriAdapter } from "./tauriLowDbAdapter";
import { Low } from "lowdb";

type N8NCredential = Record<string, { id: string; name: string }>;


const emptyDatabase: credentialsDatabaseType = {
    enviroments: [],
    connections: [],
    credentials_instances: []
}

export class WorkFlowManager {
    public constructor(private selectedPath: string) {
    }

    public async addWorkFlow(workflowJSON: any) {
        const adapter = new TauriAdapter(this.selectedPath + '/db.json', emptyDatabase);
        const db = new Low(adapter, emptyDatabase);
        db.data.enviroments.push({
            id: 1,
            name: "AA"
        });

        await db.write();
        const newJsonContent = this.replaceCredentials(workflowJSON);

        const workFlowString = JSON.stringify(newJsonContent);
        const encoder = new TextEncoder();
        const content = encoder.encode(workFlowString);

        const fileName = workflowJSON.name + ".json";
        const newFilePath = [this.selectedPath, "nodes", fileName].join("/");
        const folder = [this.selectedPath, "nodes"].join("/");
        await mkdir(folder, {
            recursive: true,
        });

        const newFile = await create(newFilePath);
        await newFile.write(content);
        await newFile.close();

    }

    private replaceCredentials(json: any) {
        try {
            const credentials: N8NCredential[] = json.nodes
                .map((item: any) => item.credentials)
                .filter((item: any) => item !== undefined);

            const findedCredentials: N8NCredential = {};
            credentials.forEach((item: N8NCredential) => {
                Object.entries(item).forEach(([key, value]) => {
                    findedCredentials[key] = value;
                });
            });
            console.log(findedCredentials);
        } catch (e) {
            console.error(e);
            toast.error("Erro ao parsear json");
        }
    };
}