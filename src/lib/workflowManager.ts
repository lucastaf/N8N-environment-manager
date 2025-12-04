import { create, mkdir, readFile } from "@tauri-apps/plugin-fs";
import { DatabaseManager } from "./database/databaseManager";
import toast from "react-hot-toast";

type N8NCredential = Record<string, { id: string; name: string }>;
export type N8NFindedCredential =
    {
        id: string,
        name: string,
        key: string,
        value: any
    };
export class WorkflowManager {
    public constructor(private databaseManager: DatabaseManager,
        private selectedPath: string,
        private addNewCredentialsEvent: (findedCredentials: N8NFindedCredential[]) => void
    ) { }

    public async addWorkFlowFromFile(workflowFilePath: string) {
        try {
            const content = await readFile(workflowFilePath);
            const decodedContent = new TextDecoder().decode(content);
            const jsonBody = JSON.parse(decodedContent);
            this.addWorkFlow(jsonBody);
        } catch (e) {
            console.error(e);
        }
    }

    private async addWorkFlow(workflowJSON: any) {
        const newJsonContent = await this.replaceCredentials(workflowJSON);

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

    private async replaceCredentials(json: any) {
        try {
            const credentials: N8NCredential[] = json.nodes
                .map((item: any) => item.credentials)
                .filter((item: any) => item !== undefined);

            const findedCredentials: N8NFindedCredential[] = [];
            credentials.forEach((item: N8NCredential) => {
                Object.entries(item).forEach(([key, value]) => {
                    findedCredentials.push({
                        id: value.id,
                        name: value.name,
                        value: value,
                        key: key
                    })
                });
            });
            const uniqueFindedCredentials = findedCredentials.filter((credential, index) =>
                findedCredentials.findIndex((item) => item.id == credential.id) == index)

            console.log(json)
            console.log(uniqueFindedCredentials);
            const notFoundedCredentials: N8NFindedCredential[] = []
            for (const credential of uniqueFindedCredentials) {
                const item = await this.databaseManager.environmentCredentialMangaer.getItemById(credential.id);
                if (!item) {
                    notFoundedCredentials.push(credential);
                    console.warn("Credencial não cadastrada:" + credential.id);
                }
            }
            if (notFoundedCredentials.length) {
                this.addNewCredentialsEvent(notFoundedCredentials);
                throw new CredentialNotFoundError("Credenciais não encontradas");

            }

            return json;
        } catch (e) {
            if (e instanceof CredentialNotFoundError) throw e;
            console.error(e);
            toast.error("Erro ao parsear json");
        }
    };
}

class CredentialNotFoundError extends Error { }