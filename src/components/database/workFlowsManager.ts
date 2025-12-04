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
//Le as credenciais do workflow
//Procura se as credenciais estão cadastradas no banco
//Se nao tiver, pede pro usuario cadastrar
//Se tiver, pula

//Com as credenciais, faz a substituição

export class WorkFlowManager {
    private db: Low<credentialsDatabaseType> | null = null;
    public constructor(private selectedPath: string) {
    }

    private async loadDatabase() {
        if (this.db !== null) return;
        const adapter = new TauriAdapter(this.selectedPath + '/db.json', emptyDatabase);
        this.db = new Low(adapter, emptyDatabase);
    }

    public async addWorkFlow(workflowJSON: any) {
        await this.loadDatabase();
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

    public async getDB() {
        await this.loadDatabase();
        return this.db!;
    }

    public async createEnviroment(enviromentName: string) {
        await this.loadDatabase();
        await this.db?.update(({ enviroments }) => enviroments.push({
            id: crypto.randomUUID(),
            name: enviromentName
        }))
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
            return json;
        } catch (e) {
            console.error(e);
            toast.error("Erro ao parsear json");
        }
    };
}