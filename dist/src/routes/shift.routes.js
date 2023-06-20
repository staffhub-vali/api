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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_model_1 = __importDefault(require("../models/User.model"));
var Shift_model_1 = __importDefault(require("../models/Shift.model"));
var WorkDay_model_1 = __importDefault(require("../models/WorkDay.model"));
var express_1 = __importDefault(require("express"));
var jwt_middleware_1 = require("../middleware/jwt.middleware");
var router = express_1.default.Router();
router
    .route('/')
    .get(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start, end, user, workDays, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, start = _a.start, end = _a.end;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                return [4 /*yield*/, WorkDay_model_1.default.find({
                        user: req.token._id,
                        date: {
                            $gte: start,
                            $lte: end,
                        },
                    }).populate({
                        path: 'shifts',
                    })];
            case 2:
                workDays = _b.sent();
                if (!workDays) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work days not found.' })];
                }
                return [2 /*return*/, res.status(200).json(workDays)];
            case 3:
                error_1 = _b.sent();
                console.log(error_1);
                res.status(500).json({ message: 'Internal Server Error.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, workDayId_1, employeeId, start, end, user, workDay, existingShift, shift, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, workDayId_1 = _a.workDayId, employeeId = _a.employeeId, start = _a.start, end = _a.end;
                if (!employeeId) {
                    return [2 /*return*/, res.status(400).json({ message: 'Please select an employee.' })];
                }
                if (!start || !end) {
                    return [2 /*return*/, res.status(400).json({ message: 'Please select a start and end time.' })];
                }
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                workDay = user.workDays.find(function (day) { return day._id.toString() === workDayId_1; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found' })];
                }
                return [4 /*yield*/, Shift_model_1.default.findOne({ workDay: workDayId_1, employee: employeeId })];
            case 2:
                existingShift = _b.sent();
                if (existingShift) {
                    return [2 /*return*/, res.status(400).json({ message: 'User already has a shift for this day.' })];
                }
                return [4 /*yield*/, Shift_model_1.default.create({ start: start, end: end, employee: employeeId, workDay: workDayId_1 })];
            case 3:
                shift = _b.sent();
                workDay.shifts.push(shift._id);
                return [4 /*yield*/, workDay.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ message: 'Shift created successfully.' })];
            case 5:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(500).json({ message: 'Internal Server Error.' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
