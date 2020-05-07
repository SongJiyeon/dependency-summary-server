"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const moduleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    }
});
exports.default = mongoose_1.model('Module', moduleSchema);
