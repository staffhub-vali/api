"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee-manager';
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log(`Connected to Database.`);
})
    .catch((err) => {
    console.error('Error connecting to Database. ', err);
});
