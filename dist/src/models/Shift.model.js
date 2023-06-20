"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var shiftSchema = new mongoose_1.default.Schema({
    start: { type: Number },
    end: { type: Number },
    workDay: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'WorkDay' },
    employee: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Employee' },
});
var Shift = mongoose_1.default.model('Shift', shiftSchema);
exports.default = Shift;
