import { Low } from "lowdb";
import { credentialsDatabaseType, onDatabaseUpdate } from "../databaseType";

export class EnviromentsManager {
    public constructor(private db: Low<credentialsDatabaseType>, private onUpdate: onDatabaseUpdate) { }

    public async createEnviroment(enviromentName: string) {
        await this.db.read();
        await this.db?.update(({ enviroments }) => enviroments.push({
            id: crypto.randomUUID(),
            name: enviromentName
        }))
        await this.onUpdate(this.db.data);
    }

    public async deleteEnvById(enviromentId: string) {
        await this.db.read();
        const index = this.db.data.enviroments.findIndex(item => item.id == enviromentId);
        if (index != -1) {
            this.db.data.enviroments.splice(index, 1);
        } else {
            throw new Error("ID não encontrado");
        }

        await this.db.write();
        await this.onUpdate(this.db.data);
    }

}