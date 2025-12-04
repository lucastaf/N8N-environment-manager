import { create, mkdir } from "@tauri-apps/plugin-fs";
import toast from "react-hot-toast";
import { credentialsDatabaseType, onDatabaseUpdate } from "./databaseType";
import { TauriAdapter } from "./tauriLowDbAdapter";
import { Low } from "lowdb";
import { EnviromentsManager as EnvironmentsManager } from "./models/enviromentsManager";
import { CredentialsManager } from "./models/credentialsManager";
import { EnvironmentCredentialManager } from "./models/environmentCredentialsManager";

type N8NCredential = Record<string, { id: string; name: string }>;


const emptyDatabase: credentialsDatabaseType = {
    environments: [],
    credentials: [],
    environments_credentials: []
}
//Le as credenciais do workflow
//Procura se as credenciais estão cadastradas no banco
//Se nao tiver, pede pro usuario cadastrar
//Se tiver, pula

//Com as credenciais, faz a substituição

export class DatabaseManager {
    private db: Low<credentialsDatabaseType>;
    public readonly environmentManager: EnvironmentsManager;
    public readonly credentialsManager: CredentialsManager;
    public readonly environmentCredentialMangaer: EnvironmentCredentialManager;

    public constructor(private selectedPath: string, private onUpdate: onDatabaseUpdate) {
        const adapter = new TauriAdapter(this.selectedPath + '/db.json', emptyDatabase);
        this.db = new Low(adapter, emptyDatabase);
        this.environmentManager = new EnvironmentsManager(this.db, this.onUpdate);
        this.credentialsManager = new CredentialsManager(this.db, this.onUpdate);
        this.environmentCredentialMangaer = new EnvironmentCredentialManager(this.db, this.onUpdate);
    }

    public async load() {
        await this.db.read();
        this.onUpdate(this.db.data);
    }

    public async addWorkFlow(workflowJSON: any) {
        await this.db.read();
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

        this.onUpdate(this.db.data);

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