import { Low } from "lowdb";
import { credentialsDatabaseType, onDatabaseUpdate } from "../databaseType";

export class EnviromentsManager {
    public constructor(private db: Low<credentialsDatabaseType>, private onUpdate: onDatabaseUpdate) { }

    public async create(enviromentName: string) {
        await this.db.read();
        await this.db?.update(({ environments: enviroments }) => enviroments.push({
            id: crypto.randomUUID(),
            name: enviromentName
        }))
        await this.onUpdate(this.db.data);
    }

    public async deleteById(enviromentId: string) {
        await this.db.read();
        const index = this.db.data.environments.findIndex(item => item.id == enviromentId);
        if (index != -1) {
            this.db.data.environments.splice(index, 1);
        } else {
            throw new Error("ID não encontrado");
        }

        await this.db.write();
        await this.onUpdate(this.db.data);
    }

}