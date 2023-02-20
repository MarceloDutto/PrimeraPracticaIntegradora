import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import morgan from 'morgan';
import __dirname from './utils.js'
import config from './config/index.js';
import router from './router/index.js';

const port = config.port;
const { userDB, passDB, hostDB } = config.db

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${userDB}:${passDB}@${hostDB}/?retryWrites=true&w=majority`, error => {
    if(error) {
        console.log(`Cannot connect with db. Error: ${error}`);
    }
})

router(app);

export { app, port };






