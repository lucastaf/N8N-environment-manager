import { Low } from "lowdb";
import { credentials, credentialsDatabaseType, onDatabaseUpdate } from "../databaseType";
import { EntityManager } from "./EntityManagerInterface";

export class CredentialsManager implements EntityManager<credentials> {
    constructor(protected db: Low<credentialsDatabaseType>, protected onUpdate: onDatabaseUpdate) {

    }

    getById(id: string): credentials | undefined {
        return this.db.data.credentials.find(item => item.id == id);
    }
    async getList(): Promise<credentials[]> {
        await this.db.read();
        return this.db.data.credentials;
    }


    public async create(credentialName: string) {
        const newItem: credentials = {
            id: crypto.randomUUID(),
            name: credentialName
        }
        await this.db.read();
        await this.db?.update(({ credentials }) => credentials.push(newItem))
        await this.onUpdate(this.db.data);
        return newItem
    }

    public async deleteById(credentialId: string) {
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