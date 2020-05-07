"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const api_1 = __importDefault(require("./routes/api"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = express_1.default();
const server = http_1.default.createServer(app);
const DB_URL = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_HOST : process.env.DB_HOST;
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.connect(`${DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.use('/auth', auth_1.default);
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
server.listen(4000);
module.exports = app;
