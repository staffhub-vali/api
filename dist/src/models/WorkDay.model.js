"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var workDaySchema = new mongoose_1.default.Schema({
    date: { type: Number, required: true, unique: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    shifts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Shift' }],
    notes: [{ type: String }],
});
var WorkDay = mongoose_1.default.model('WorkDay', workDaySchema);
exports.default = WorkDay;
