import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';

import indexRouter from './routes/index';
import authRouter from './routes/auth';

import BaseRouter from './routes/index';
import AuthRouter from './routes/auth';

dotenv.config();

const app = express();
const server: http.Server = http.createServer(app);

const DB_URL = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_HOST : process.env.DB_HOST;

mongoose.set('useCreateIndex', true);
mongoose.connect(`${DB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', indexRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

server.listen(4000);

module.exports = app;
