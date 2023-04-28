"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    article: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Article',
    },
    content: {
        type: String,
        required: [true, 'Content is required.'],
    },
    likes: {
        type: Number,
    },
}, {
    timestamps: true,
});
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
module.exports = Comment;
