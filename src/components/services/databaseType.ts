type enviroment = {
    id: number,
    name: string
}

type connections = {
    id: number,
    name: string
}

type credentials_instances = {
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