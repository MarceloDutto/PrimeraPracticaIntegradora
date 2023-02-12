import fs, { existsSync, promises } from 'fs';

class fileManager {
    constructor (file) {
        this.file = `${process.cwd()}/src/files/${file}`;
    }

    loadItems = async () => {
        if(existsSync(this.file)) {
            const data = await promises.readFile(this.file);
            const response = JSON.parse(data);
            return response;
        } else {
            return [];
        }
    }
}

export default fileManager;