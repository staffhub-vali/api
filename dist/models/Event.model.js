"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    host: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Comment',
    },
    attendees: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
    },
    images: {
        type: String,
    },
    likes: {
        type: Number,
    },
    map: {
        type: String,
    },
    subject: {
        type: String,
    },
    time: {
        type: String,
    },
}, {
    timestamps: true,
});
const Event = (0, mongoose_1.model)('Event', eventSchema);
module.exports = Event;
