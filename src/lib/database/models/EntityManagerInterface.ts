export interface EntityManager<T> {
    getById(id: string): T | undefined;
    getList(): Promise<T[]>;
    create(...args: any[]): Promise<T>;
    deleteById(id: string): Promise<void>;
}