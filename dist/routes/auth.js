"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.Router();
router.post('/login', async (req, res, next) => {
    const githubUser = (await axios_1.default({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: { 'Authorization': 'token ' + req.body.access_token }
    })).data;
    const user = (await User_1.default.exists({ node_id: githubUser.node_id })) ?
        await User_1.default.findOne({ node_id: githubUser.node_id })
        : await User_1.default.create({ ...githubUser });
    const secret = process.env.JWT_SECRET;
    const jwtToken = secret && jsonwebtoken_1.default.sign({ user }, secret);
    res.header({ jwttoken: jwtToken }).json({ 'result': 'ok' });
});
exports.default = router;
