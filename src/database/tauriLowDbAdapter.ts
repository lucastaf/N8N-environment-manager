import { readTextFile, writeTextFile, exists } from "@tauri-apps/plugin-fs";

export class TauriAdapter<T> {
    private path: string;
    private defaultData: T;
    constructor(path: string, defaultData: T) {
        this.path = path;
        this.defaultData = defaultData;
    }

    async read() {
        const fileExists = await exists(this.path);
        if (!fileExists) {
            await writeTextFile(this.path, JSON.stringify(this.defaultData, null, 2));
            return this.defaultData;
        }
        const content = await readTextFile(this.path);
        return JSON.parse(content);
    }

    async write(data: T) {
        await writeTextFile(this.path, JSON.stringify(data, null, 2));
    }
}
