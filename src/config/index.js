import * as dotenv from 'dotenv';
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    db: {
        userDB: process.env.USER_DB || 'admin',
        passDB: process.env.PASS_DB || 'coderbackendadmin',
        hostDB: process.env.HOST_DB || 'coderbackend.ngqatly.mongodb.net'
    }
}

export default config;