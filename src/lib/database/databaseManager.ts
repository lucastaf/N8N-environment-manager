import { credentialsDatabaseType, onDatabaseUpdate } from "./databaseType";
import { TauriAdapter } from "./tauriLowDbAdapter";
import { Low } from "lowdb";
import { EnviromentsManager as EnvironmentsManager } from "./models/enviromentsManager";
import { CredentialsManager } from "./models/credentialsManager";
import { EnvironmentCredentialManager } from "./models/environmentCredentialsManager";

const emptyDatabase: credentialsDatabaseType = {
    environments: [],
    credentials: [],
    environments_credentials: []
}

export class DatabaseManager {
    private db: Low<credentialsDatabaseType>;
    public readonly environmentManager: EnvironmentsManager;
    public readonly credentialsManager: CredentialsManager;
    public readonly environmentCredentialMangaer: EnvironmentCredentialManager;

    public constructor(private selectedPath: string, private onUpdate: onDatabaseUpdate) {
        const adapter = new TauriAdapter(this.selectedPath + '/db.json', emptyDatabase);
        this.db = new Low(adapter, emptyDatabase);
        this.environmentManager = new EnvironmentsManager(this.db, this.onUpdate);
        this.credentialsManager = new CredentialsManager(this.db, this.onUpdate);
        this.environmentCredentialMangaer = new EnvironmentCredentialManager(this.db, this.onUpdate);
    }

    public async load() {
        await this.db.read();
        this.onUpdate(this.db.data);
    }
}