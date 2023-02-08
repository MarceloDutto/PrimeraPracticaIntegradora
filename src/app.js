import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import __dirname from './utils.js'
import router from './router/index.js';

dotenv.config()

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('static', express.static(__dirname + '/public'));

router(app);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})
