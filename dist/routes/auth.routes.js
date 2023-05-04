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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const saltRounds = 10;
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        if (name === '' || username === '' || email === '' || password === '') {
            res.status(400).json({ message: 'Please fill out all the fields.' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Provide a valid email address.' });
            return;
        }
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
            });
            return;
        }
        const user = yield User_model_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        yield User_model_1.default.create({ email, password: hashedPassword, username, name });
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (err) {
        res.json(err);
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, rememberMe } = req.body;
        if (username === '' || password === '') {
            res.status(400).json({ message: 'Please provide an email and a password.' });
            return;
        }
        const user = yield User_model_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Wrong Email or Password.' });
            return;
        }
        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if (passwordCorrect) {
            const { _id, username } = user;
            const payload = { id: _id, username };
            let expiresIn = '6h';
            if (rememberMe) {
                expiresIn = '256h';
            }
            const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                algorithm: 'HS256',
                expiresIn: expiresIn,
            });
            res.status(200).json({ authToken: authToken, user: { username: user.username, id: user._id } });
        }
        else {
            res.status(401).json({ message: 'Unable to authenticate the user' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.get('/verify', jwt_middleware_1.isAuthenticated, (req, res) => {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
});
module.exports = router;
