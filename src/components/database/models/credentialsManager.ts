import { Low } from "lowdb";
import { credentialsDatabaseType, onDatabaseUpdate } from "../databaseType";

export class CredentialsManager {
    public constructor(private db: Low<credentialsDatabaseType>, private onUpdate: onDatabaseUpdate) { }

    public async createCredential(credentialName: string) {
        await this.db.read();
        await this.db?.update(({ credentials }) => credentials.push({
            id: crypto.randomUUID(),
            name: credentialName
        }))
        await this.onUpdate(this.db.data);
    }

    public async deleteCredentialById(credentialId: string) {
        await this.db.read();
        const index = this.db.data.credentials.findIndex(item => item.id == credentialId);
        if (index != -1) {
            this.db.data.credentials.splice(index, 1);
        } else {
            throw new Error("ID não encontrado");
        }

        await this.db.write();
        await this.onUpdate(this.db.data);
    }

}