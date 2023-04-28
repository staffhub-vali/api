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
router.post('/user/following', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currentUserId } = req.body;
    try {
        const currentUser = yield User.findById(currentUserId);
        currentUser.following.push(userId);
        yield currentUser.save();
        const userToFollow = yield User.findById(userId);
        userToFollow.followers.push(currentUserId);
        yield userToFollow.save();
        res.status(200).json({ message: 'Followed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error following user', error });
    }
}));
router.post('/user/unfollowing', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currentUserId } = req.body;
    try {
        const currentUser = yield User.findById(currentUserId);
        const followIndex = currentUser.following.indexOf(userId);
        if (followIndex > -1) {
            currentUser.following.splice(followIndex, 1);
        }
        yield currentUser.save();
        const userToUnfollow = yield User.findById(userId);
        const followerIndex = userToUnfollow.followers.indexOf(currentUserId);
        if (followerIndex > -1) {
            userToUnfollow.followers.splice(followerIndex, 1);
        }
        yield userToUnfollow.save();
        res.status(200).json({ message: 'Unfollowed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error unfollowing user', error });
    }
}));
router.get('/user/:id/following', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User.findById(id);
        if (user) {
            res.status(200).json({ following: user.following });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user following list', error });
    }
}));
router.get('/user/:id/following-users', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User.findById(id).populate('following');
        if (user) {
            res.status(200).json({ followingUsers: user.following });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching following users', error });
    }
}));
router.get('/user/:userId/followers', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.params.userId).populate('followers');
        res.json(user.followers);
    }
    catch (err) {
        res.status(400).json({ message: 'Error getting followers.' });
    }
}));
module.exports = router;
