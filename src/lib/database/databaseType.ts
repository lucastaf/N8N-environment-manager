export type environments = {
    id: string,
    name: string
}

export type credentials = {
    id: string,
    name: string
}

export type environments_credentials = {
    id: string,
    id_environment: string,
    id_credential: string,
    value: any
}

export type credentialsDatabaseType = {
    environments: environments[]
    credentials: credentials[]
    environments_credentials: environments_credentials[]
}

export type onDatabaseUpdate = (newDatabase: credentialsDatabaseType) => void