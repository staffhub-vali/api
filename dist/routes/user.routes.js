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
const router = require('express').Router();
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const jwt = require('jsonwebtoken');
router.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const user = yield User.findById(userId)
            .populate({
            path: 'conversations',
            populate: [{ path: 'messages' }, { path: 'participants' }],
        })
            .populate('following')
            .populate('followers');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        if (!users) {
            return res.status(404).json({ message: 'No users found.' });
        }
        return res.json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
router.get('/users/current', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    try {
        const user = yield User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/users/current', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.payload;
    console.log(req.payload);
    try {
        const user = yield User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = req.body.username || user.username;
        user.location = req.body.location || user.location;
        user.profession = req.body.profession || user.profession;
        user.description = req.body.description || user.description;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        console.log(req.body.profilePicture);
        yield user.save();
        const authToken = jwt.sign({ username: user.username, id: user._id }, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '24h',
        });
        return res.json({ user: { username: user.username, id: user._id }, authToken });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}));
module.exports = router;
