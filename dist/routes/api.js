"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = __importDefault(require("lodash"));
const User_1 = __importDefault(require("../models/User"));
const Module_1 = __importDefault(require("../models/Module"));
const router = express_1.Router();
router.post('/module_usage', (req, res, next) => {
    const modules = req.body.modules;
    const secret = process.env.JWT_SECRET;
    const verifiedUser = secret && jsonwebtoken_1.default.verify(req.body.jwtToken, secret);
    lodash_1.default.uniq(modules).forEach(async (module) => {
        (await Module_1.default.exists({ name: module })) ?
            await Module_1.default.findOneAndUpdate({ name: module }, {
                $inc: {
                    value: 1
                }
            })
            : await Module_1.default.create({ name: module, value: 1 });
        const moduleInUser = await User_1.default.findOne({
            '_id': verifiedUser.user._id,
            'moduleUsed.name': module
        });
        moduleInUser ?
            await User_1.default.findOneAndUpdate({
                '_id': verifiedUser.user._id,
                'moduleUsed.name': module
            }, {
                $inc: {
                    'moduleUsed.$.value': 1
                }
            })
            : await User_1.default.findByIdAndUpdate(verifiedUser.user._id, {
                $push: {
                    moduleUsed: {
                        name: module,
                        value: 1
                    }
                }
            });
    });
    res.json({ 'result': 'ok' });
});
router.post('/top5', async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const verifiedUser = secret && jsonwebtoken_1.default.verify(req.body.jwttoken, secret);
    const user = await User_1.default.findById(verifiedUser.user._id);
    const userTop5 = lodash_1.default.take(lodash_1.default.orderBy(user === null || user === void 0 ? void 0 : user.moduleUsed, 'value', 'desc'), 5);
    const totalTop5 = await Module_1.default.find().sort({ value: -1 }).limit(5);
    res.json({ userTop5, totalTop5 });
});
exports.default = router;
