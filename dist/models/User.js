"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
;
const UserSchema = new mongoose_1.Schema({
    node_id: {
        type: String,
        required: true,
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    html_url: {
        type: String
    },
    avatar_url: {
        type: String
    },
    moduleUsed: [{
            name: {
                type: String,
                required: true,
                unique: true
            },
            value: {
                type: Number,
                required: true
            }
        }]
});
exports.default = mongoose_1.model('User', UserSchema);
