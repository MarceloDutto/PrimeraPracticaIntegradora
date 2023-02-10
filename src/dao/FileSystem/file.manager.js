import fs, { existsSync, writeFile, promises } from 'fs';

class FileManager {
    constructor(file) {
        this.file = `${process.cwd}/src/files/${file}`;
    }

    readFile = async () => {
        if(!existsSync(this.path)) return 'No se encontró el archivo';

        try {
            const data = await promises.readFile(this.file, 'utf-8');
            const response = JSON.parse(data);
            return response;
        } catch (error) {
            console.log(error)
            throw error;
        }
    } 

    writeFile = (data) => {
        dataStr = JSON.stringify(data, null, 2);
        writeFile(file, dataStr, error => {
            if(error) {
                console.log(error);
                throw error
            }
        })
    }
}

export default FileManager;
