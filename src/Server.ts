require('dotenv').config();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes/index';
import AuthRouter from './routes/auth';
import logger from '@shared/Logger';


// Init express
const app = express();

const DB_URL = process.env.NODE_ENV === 'testing' ? process.env.DB_TEST_HOST : process.env.DB_HOST;

mongoose.set('useCreateIndex', true);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cors({origin:"http://localhost:3000"}));
app.set('jwt-secret', process.env.JWT_SECRET);

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/auth', AuthRouter);
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;
