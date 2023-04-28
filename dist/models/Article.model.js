"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleSchema = new mongoose_1.Schema({
    author: {
        ref: 'User',
        type: mongoose_1.Schema.Types.ObjectId,
    },
    comments: {
        ref: 'Comment',
        type: [mongoose_1.Schema.Types.ObjectId],
    },
    content: {
        required: [true, 'Content is required.'],
        type: String,
    },
    description: {
        default: null,
        type: String,
    },
    imageUrl: {
        default: null,
        type: String,
    },
    likedBy: {
        ref: 'User',
        type: [mongoose_1.Schema.Types.ObjectId],
    },
    likes: {
        default: 0,
        type: Number,
    },
    title: {
        required: [true, 'Title is required.'],
        type: String,
    },
}, {
    timestamps: true,
});
const Article = (0, mongoose_1.model)('Article', articleSchema);
module.exports = Article;
