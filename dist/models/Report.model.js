"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    id: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Article',
            },
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Comment',
            },
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Conversation',
            },
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    content: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
    },
}, {
    timestamps: true,
});
const Report = (0, mongoose_1.model)('Report', reportSchema);
module.exports = Report;
