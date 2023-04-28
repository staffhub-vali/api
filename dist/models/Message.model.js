"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: [true, 'Message is required.'],
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Sender is required.'],
        ref: 'User',
    },
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Recipient is required.'],
        ref: 'User',
    },
}, {
    timestamps: true,
});
const Message = (0, mongoose_1.model)('Message', messageSchema);
module.exports = Message;
