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
const Comment = require('../models/Comment.model');
const Article = require('../models/Article.model');
const jwt_middleware_1 = require("../middleware/jwt.middleware");
router.get('/community/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Article.find().populate('author');
        res.json(data);
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving Articles.',
        });
    }
}));
router.post('/community/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, content, imageUrl } = req.body;
        console.log(content);
        if (!userId || !title || !content) {
            console.log('Missing required fields.');
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
        const author = yield User.findById(userId);
        if (!author) {
            console.log('User not found');
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const article = yield Article.create({
            author,
            title,
            content,
            imageUrl,
        });
        if (!article) {
            console.log('Error creating Article');
            return res.status(404).json({ message: 'Error creating Article' });
        }
        yield author.updateOne({ $push: { articles: article } });
        res.status(201).json(article);
    }
    catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({
            message: 'Error creating Article',
        });
    }
}));
router.get('/community/article/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const articleDetails = yield Article.findById(articleId)
            .populate('author')
            .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User',
            },
        });
        res.json(articleDetails);
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving the Article',
        });
    }
}));
router.put('/community/article/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const updatedArticle = yield Article.findByIdAndUpdate(articleId, req.body, { new: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Article' });
    }
}));
router.delete('/community/article/:articleId', jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { articleId, userId } = req.query;
        if (!articleId || !userId) {
            return res.status(400).json({ message: 'Missing query Parameters.' });
        }
        const article = yield Article.findById(articleId).populate('comments').populate('author');
        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }
        if (((_a = article.author) === null || _a === void 0 ? void 0 : _a._id.toString()) !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const user = yield User.findById(userId).populate('articles').populate('comments');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const articleIndex = user.articles.findIndex((a) => a._id.equals(articleId));
        if (articleIndex !== -1) {
            user.articles.splice(articleIndex, 1);
            yield user.save();
        }
        for (const comment of article.comments) {
            const commentIndex = user.comments.findIndex((c) => c._id.equals(comment._id));
            if (commentIndex !== -1) {
                user.comments.splice(commentIndex, 1);
                yield user.save();
            }
            yield Comment.findByIdAndDelete(comment._id);
        }
        yield Article.findByIdAndDelete(articleId);
        res.status(200).json({ message: 'Article deleted Successfully.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting Article' });
    }
}));
router.get('/users/:userId/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const articles = yield Article.find({ author: userId }).populate('author');
        res.status(200).json({ articles });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error getting the list of Articles',
        });
    }
}));
router.post('/community/article/:articleId/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const { userId } = req.body;
        const updatedArticle = yield Article.findByIdAndUpdate(articleId, {
            $inc: { likes: 1 },
            $push: { likedBy: userId },
        }, { new: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Article' });
    }
}));
router.put('/community/article/:articleId/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const { userId } = req.body;
        const updatedArticle = yield Article.findByIdAndUpdate(articleId, {
            $inc: { likes: -1 },
            $pull: { likedBy: userId },
        }, { new: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating Article' });
    }
}));
module.exports = router;
