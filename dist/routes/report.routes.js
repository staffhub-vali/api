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
const Report = require('../models/Report.model');
router.post('/report', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, content } = req.body;
        yield Report.create({ id, content });
        res.status(200).json({ message: 'Report submitted. Thank you for making this website a better place.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
}));
router.post('/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, content, subject } = req.body;
    console.log(req.body);
    try {
        yield Report.create({ id, content, subject });
        res.status(200).json({ message: 'Form submitted.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
}));
module.exports = router;
