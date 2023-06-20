"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var employeeSchema = new mongoose_1.default.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    notes: { type: [String] },
    shiftPreferences: { type: [String] },
    vacationDays: { type: Number, default: 25 },
    vacations: { type: [{ start: Number, end: Number }] },
});
var Employee = mongoose_1.default.model('Employee', employeeSchema);
exports.default = Employee;
