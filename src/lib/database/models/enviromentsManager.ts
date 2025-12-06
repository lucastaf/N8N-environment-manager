import { Low } from "lowdb";
import { credentialsDatabaseType, environments, onDatabaseUpdate } from "../databaseType";
import { EntityManager } from "./EntityManagerInterface";

export class EnviromentsManager implements EntityManager<environments> {
    public constructor(private db: Low<credentialsDatabaseType>, private onUpdate: onDatabaseUpdate) { }
    getById(id: string): environments | undefined {
        return this.db.data.environments.find(item => item.id == id);
    }
    async getList(): Promise<environments[]> {
        await this.db.read();
        return this.db.data.environments;
    }

    public async create(enviromentName: string) {
        await this.db.read();
        const newData = {
            id: crypto.randomUUID(),
            name: enviromentName
        }
        await this.db?.update(({ environments: enviroments }) => enviroments.push(newData))
        await this.onUpdate(this.db.data);
        return newData;
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