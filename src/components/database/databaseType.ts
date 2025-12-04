export type environment = {
    id: string,
    name: string
}

export type credentials = {
    id: string,
    name: string
}

export type environments_credentials = {
    id: string,
    id_environment: number,
    id_credential: number,
    value: any
}

export type credentialsDatabaseType = {
    environments: environment[]
    credentials: credentials[]
    environments_credentials: environments_credentials[]
}

export type onDatabaseUpdate = (newDatabase: credentialsDatabaseType) => void