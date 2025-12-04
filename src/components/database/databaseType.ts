export type enviroment = {
    id: string,
    name: string
}

export type connections = {
    id: string,
    name: string
}

export type credentials_instances = {
    id: string,
    id_enviroment: number,
    id_connection: number,
    value: any
}

export type credentialsDatabaseType = {
    enviroments: enviroment[]
    connections: connections[]
    credentials_instances: credentials_instances[]
}