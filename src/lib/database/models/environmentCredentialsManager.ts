import { Low } from "lowdb";
import { credentials, credentialsDatabaseType, environments, environments_credentials, onDatabaseUpdate } from "../databaseType";

export type mergedEnvironmentsCredentials = Array<
    environments_credentials & {
        credential: credentials,
        environment: environments
    }>

export class EnvironmentCredentialManager {
    public constructor(private db: Low<credentialsDatabaseType>, private onUpdate: onDatabaseUpdate) { }

    public async create(id: string, envId: string, credentialId: string, value: any) {
        await this.db.read();
        await this.db?.update(({ environments_credentials }) => environments_credentials.push({
            id: id,
            id_credential: credentialId,
            id_environment: envId,
            value: value
        }))
        await this.onUpdate(this.db.data);
    }

    public async deleteById(credentialId: string) {
        await this.db.read();
        const index = this.db.data.environments_credentials.findIndex(item => item.id == credentialId);
        if (index != -1) {
            this.db.data.environments_credentials.splice(index, 1);
        } else {
            throw new Error("ID não encontrado");
        }

        await this.db.write();
        await this.onUpdate(this.db.data);
    }

    public async getMergedList() {
        await this.db.read();
        const credentials = this.db.data.credentials;
        const environments = this.db.data.environments;
        const list: mergedEnvironmentsCredentials = this.db.data.environments_credentials.map(item => {
            const credential = credentials.find(credential => credential.id == item.id_credential)!;
            const environment = environments.find(env => env.id == item.id_environment)!;
            if (!credential || !environment) {
                console.warn("Credential or environment not found");
            }
            return {
                ...item,
                credential: credential,
                environment: environment,
            }
        })

        return list;
    }

}