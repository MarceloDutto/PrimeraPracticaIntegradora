import * as dotenv from 'dotenv';
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    db: {
        userDB: process.env.USER_DB,
        passDB: process.env.PASS_DB,
        hostDB: process.env.HOST_DB
    },
    session: {
        sessionSecret: process.env.SESSION_SECRET
    }
}

export default config;