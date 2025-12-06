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
    private lastFilePath: string | undefined;
    public constructor(private databaseManager: DatabaseManager,
        private selectedPath: string,
        private addNewCredentialsEvent: (findedCredentials: N8NFindedCredential[]) => void
    ) { }

    public async addWorkFlowFromFile(workflowFilePath: string) {
        this.lastFilePath = workflowFilePath;
        try {

            const content = await readFile(workflowFilePath);
            const decodedContent = new TextDecoder().decode(content);
            const jsonBody = JSON.parse(decodedContent);
            this.addWorkFlow(jsonBody);
        } catch (e) {
            console.error(e);
        }
    }

    public async retryWorkFlowAdd() {
        if (!this.lastFilePath) throw new Error("No file added");
        await this.addWorkFlowFromFile(this.lastFilePath);
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
            //Find Credentials
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

            //Garantuee every credential is on the database
            const notFoundedCredentials: N8NFindedCredential[] = []
            for (const credential of uniqueFindedCredentials) {
                const item = await this.databaseManager.environmentCredentialMangaer.getById(credential.id);
                if (!item) {
                    notFoundedCredentials.push(credential);
                    console.warn("Credencial não cadastrada:" + credential.id);
                }
            }
            if (notFoundedCredentials.length) {
                this.addNewCredentialsEvent(notFoundedCredentials);
                throw new CredentialNotFoundError("Credenciais não encontradas");
            }

            const newNodes = json.nodes.map((node: any) => {
                const originalCredentials: N8NCredential | undefined = node.credentials;
                if (originalCredentials) {
                    Object.entries(originalCredentials).map((([key, value]) => {
                        const replacedCredential = this.databaseManager.environmentCredentialMangaer.getById(value.id);
                        node.credentials[key] = replacedCredential?.id_credential;
                    }));
                }
                return node;
            })

            return newNodes;
        } catch (e) {
            if (e instanceof CredentialNotFoundError) throw e;
            console.error(e);
            toast.error("Erro ao parsear json");
        }
    };
}

class CredentialNotFoundError extends Error { }