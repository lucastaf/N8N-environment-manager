import toast from "react-hot-toast";
import { DatabaseManager } from "./database/databaseManager";
import { N8NFindedCredential } from "./workflowManager";

type N8NCredential = Record<string, { id: string; name: string }>;
export class CredentialNotFoundError extends Error {
    constructor(message: string, public credentials: N8NFindedCredential[]) {
        super(message);
    }
}

export class WorkFlowReplacer {
    public constructor(private databaseManager: DatabaseManager) {

    }

    public async replaceGenericToCredentials(json: any, environmentId: string) {
        await this.databaseManager.load();

        const newNodes = json.nodes.map((node: any) => {
            const originalCredentials: Record<string, string> | undefined = node.credentials;
            if (originalCredentials) {
                Object.entries(originalCredentials).map((([key, value]) => {
                    const replacedCredential = this.databaseManager.environmentCredentialMangaer.getCredentialByEnvironment(value, environmentId);
                    node.credentials[key] = replacedCredential;
                }));
            }
            return node;
        });

        json.nodes = newNodes;

        return json
    }


    public async replaceCredentialsToGeneric(json: any) {
        try {
            const uniqueFindedCredentials = this.getUniqueCredentials(json);

            await this.checkForNotFoundCredentials(uniqueFindedCredentials);

            const newNodes = json.nodes.map((node: any) => {
                const originalCredentials: N8NFindedCredential | undefined = node.credentials;
                if (originalCredentials) {
                    Object.entries(originalCredentials).map((([key, value]) => {
                        const replacedCredential = this.databaseManager.environmentCredentialMangaer.getById(value.id);
                        node.credentials[key] = replacedCredential?.id_credential;
                    }));
                }
                return node;
            })

            json.nodes = newNodes;

            return json;
        } catch (e) {
            if (e instanceof CredentialNotFoundError) throw e;
            console.error(e);
            toast.error("Erro ao parsear json");
        }
    };

    private getUniqueCredentials(json: any) {
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
        return findedCredentials.filter((credential, index) =>
            findedCredentials.findIndex((item) => item.id == credential.id) == index)
    }

    private async checkForNotFoundCredentials(uniqueFindedCredentials: N8NFindedCredential[]) {
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
            throw new CredentialNotFoundError("Credenciais não encontradas", notFoundedCredentials);
        }

    }
}