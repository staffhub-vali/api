"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Article = require('../models/Article.model');
const Comment = require('../models/Comment.model');
const jwt_middleware_1 = require("../middleware/jwt.middleware");
router.post('/comment', jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, commentValue, articleId } = req.body;
        const author = yield User.findById(userId).populate('comments');
        if (!author) {
            return res.status(404).json({ message: 'User not found' });
        }
        const article = yield Article.findById(articleId).populate('comments');
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const comment = yield Comment.create({ author, article: articleId, content: commentValue });
        author.comments.push(comment);
        article.comments.push(comment);
        yield Promise.all([comment.save(), author.save(), article.save()]);
        return res.status(200).json({ message: 'Comment created successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
router.put('/comment', jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { editedComment, commentId, userId } = req.body;
        const comment = yield Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (((_a = comment.author) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        comment.content = editedComment;
        yield comment.save();
        return res.status(200).json({ message: 'Comment updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
router.delete('/comment', jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, articleId, userId } = req.query;
        const deletedComment = yield Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        yield Article.updateOne({ _id: articleId }, { $pull: { comments: deletedComment._id } });
        yield User.updateOne({ _id: userId }, { $pull: { comments: deletedComment._id } });
        return res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
module.exports = router;
