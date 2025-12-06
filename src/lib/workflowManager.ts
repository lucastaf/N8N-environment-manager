import { create, mkdir, readDir, readFile } from "@tauri-apps/plugin-fs";
import { DatabaseManager } from "./database/databaseManager";
import toast from "react-hot-toast";
import { CredentialNotFoundError, WorkFlowReplacer } from "./workflowReplacer";

export type N8NFindedCredential =
    {
        id: string,
        name: string,
        key: string,
        value: any
    };

export type WorkFlowFile = {
    name: string,
    id: string,
    fileName: string,
    filePath: string
}
export class WorkflowManager {
    private lastFilePath: string | undefined;
    private workFlowReplacer: WorkFlowReplacer
    public constructor(private databaseManager: DatabaseManager,
        private selectedPath: string,
        private addNewCredentialsEvent: (findedCredentials: N8NFindedCredential[]) => void
    ) {
        this.workFlowReplacer = new WorkFlowReplacer(this.databaseManager);
    }

    public async addWorkFlowFromFile(workflowFilePath: string) {
        this.lastFilePath = workflowFilePath;
        try {
            const content = await readFile(workflowFilePath);
            const decodedContent = new TextDecoder().decode(content);
            const jsonBody = JSON.parse(decodedContent);
            await this.addWorkFlow(jsonBody);
            toast.success("File added successfully");
        } catch (e: unknown) {
            if (!(e instanceof CredentialNotFoundError)) {
                this.addNewCredentialsEvent((e as CredentialNotFoundError).credentials);
                toast.error("Error when uploading file");
            }
            console.error(e);
        }
    }

    public async downloadWorkflow(workFlowTemplatePath: string, environmentId: string) {
        try {
            const content = await readFile(workFlowTemplatePath);
            const decodedContent = new TextDecoder().decode(content);
            const jsonBody = JSON.parse(decodedContent);
            const newWorkflow = await this.workFlowReplacer.replaceGenericToCredentials(jsonBody, environmentId);
            console.log(newWorkflow);
        } catch (e) {
            toast.error("Error when downloading file");
            console.error(e);
        }
    }

    public async listFiles(): Promise<WorkFlowFile[]> {
        const path = [this.selectedPath, "nodes"].join("/");
        const files = await readDir(path);

        const results: Array<WorkFlowFile | undefined> = await Promise.all(files.map(async (file) => {
            if (file.isFile && file.name.endsWith(".json")) {
                try {
                    const filePath = path + "/" + file.name
                    const content = await readFile(filePath);
                    const decodedContent = new TextDecoder().decode(content);
                    const fileData = JSON.parse(decodedContent);
                    return {
                        id: fileData.id,
                        name: fileData.name,
                        fileName: file.name,
                        filePath: filePath
                    }
                } catch (e) {
                    console.warn("Error when reading jsonFile", e);
                }
            }
        }));
        return results.filter((item): item is WorkFlowFile => item !== undefined);
    }



    public async retryWorkFlowAdd() {
        if (!this.lastFilePath) throw new Error("No file added");
        await this.addWorkFlowFromFile(this.lastFilePath);
    }

    private async addWorkFlow(workflowJSON: any) {
        const newJsonContent = await this.workFlowReplacer.replaceCredentialsToGeneric(workflowJSON);

        const workFlowString = JSON.stringify(newJsonContent, undefined, 2);
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



}

