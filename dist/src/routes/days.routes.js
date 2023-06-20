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
var WorkDay_model_1 = __importDefault(require("../models/WorkDay.model"));
var Shift_model_1 = __importDefault(require("../models/Shift.model"));
var express_1 = __importDefault(require("express"));
var jwt_middleware_1 = require("../middleware/jwt.middleware");
var router = express_1.default.Router();
router.get('/', jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var skip, nextSkip, currentDate, today, currentDayOfWeek, startOfWeek, endOfWeek, user, workDays, startOfNextWeek, endOfNextWeek, workDaysNextWeek, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                skip = req.query.skip;
                skip = parseInt(skip) || 0;
                nextSkip = 0;
                if (skip > 0) {
                    nextSkip = skip + 1;
                }
                if (skip < 0) {
                    nextSkip = skip - 1;
                }
                currentDate = Math.floor(Date.now() / 1000);
                today = new Date();
                currentDayOfWeek = today.getDay();
                startOfWeek = currentDate - currentDayOfWeek * 24 * 60 * 60 + skip * 7 * 24 * 60 * 60;
                endOfWeek = startOfWeek + 7 * 24 * 60 * 60;
                return [4 /*yield*/, User_model_1.default.findOne({ _id: req.token._id })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                return [4 /*yield*/, WorkDay_model_1.default.find({
                        user: req.token._id,
                        date: { $gte: startOfWeek, $lte: endOfWeek },
                    }).populate({
                        path: 'shifts',
                        populate: {
                            path: 'employee',
                        },
                    })];
            case 2:
                workDays = _a.sent();
                if (!workDays) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work days not found.' })];
                }
                startOfNextWeek = currentDate - currentDayOfWeek * 24 * 60 * 60 + nextSkip * 7 * 24 * 60 * 60;
                endOfNextWeek = startOfNextWeek + 7 * 24 * 60 * 60;
                return [4 /*yield*/, WorkDay_model_1.default.find({
                        date: { $gte: startOfNextWeek, $lte: endOfNextWeek },
                    })];
            case 3:
                workDaysNextWeek = _a.sent();
                res.status(200).json({ workDays: workDays, length: workDaysNextWeek.length });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({ message: 'Server Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router
    .route('/notes')
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, day_1, note, user, workDay, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, day_1 = _a.day, note = _a.note;
                if (!note) {
                    return [2 /*return*/, res.status(400).json({ message: 'Cannot create empty notes.' })];
                }
                return [4 /*yield*/, User_model_1.default.findOne({ _id: req.token._id }).populate({
                        path: 'workDays',
                        populate: {
                            path: 'notes',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (d) { return d._id.toString() === day_1; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                workDay.notes.push(note);
                return [4 /*yield*/, workDay.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Note saved successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(500).json({ message: 'Interal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, note, index, workDayId_1, user, workDay, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, note = _a.note, index = _a.index, workDayId_1 = _a.workDayId;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                        populate: {
                            path: 'notes',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (d) { return d._id.toString() === workDayId_1; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                workDay.notes[index] = note;
                return [4 /*yield*/, workDay.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Note updated successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.log(error_3);
                res.status(500).json({ message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id_1, index, user, workDay, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, id_1 = _a.workDay, index = _a.index;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                        populate: {
                            path: 'notes',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (d) { return d._id.toString() === id_1; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                workDay.notes.splice(index, 1);
                return [4 /*yield*/, workDay.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Note deleted successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.log(error_4);
                res.status(500).json({ message: 'Interal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router
    .route('/:id')
    .get(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, workDay, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                        populate: {
                            path: 'shifts',
                            populate: {
                                path: 'employee',
                            },
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (workDay) { return workDay._id.toString() === req.params.id; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                res.status(200).json(workDay);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(500).json({ message: 'Interal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, workDayId_2, shifts, user, workDay, newShifts, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, workDayId_2 = _a._id, shifts = _a.shifts;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                        populate: {
                            path: 'shifts',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (workDay) { return workDay._id.toString() === workDayId_2; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                return [4 /*yield*/, Shift_model_1.default.deleteMany({ _id: { $in: workDay.shifts } })];
            case 2:
                _b.sent();
                return [4 /*yield*/, Shift_model_1.default.insertMany(shifts)];
            case 3:
                newShifts = _b.sent();
                workDay.shifts = newShifts.map(function (shift) { return shift._id; });
                return [4 /*yield*/, workDay.save()];
            case 4:
                _b.sent();
                res.status(200).json({ message: 'Shift updated successfully.' });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                console.log(error_6);
                res.status(500).json({ message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, shiftId_1, workDayId_3, user, workDay, shiftIndex, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.query, shiftId_1 = _a.shiftId, workDayId_3 = _a.workDayId;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'workDays',
                        populate: {
                            path: 'shifts',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                workDay = user.workDays.find(function (workDay) { return workDay._id.toString() === workDayId_3; });
                if (!workDay) {
                    return [2 /*return*/, res.status(404).json({ message: 'Work day not found.' })];
                }
                return [4 /*yield*/, Shift_model_1.default.findByIdAndDelete(shiftId_1)];
            case 2:
                _b.sent();
                shiftIndex = workDay.shifts.findIndex(function (shift) { return shift._id.toString() === shiftId_1; });
                if (!(shiftIndex !== -1)) return [3 /*break*/, 4];
                workDay.shifts.splice(shiftIndex, 1);
                return [4 /*yield*/, workDay.save()];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.status(200).json({ message: 'Shift deleted successfully.' });
                return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                console.log(error_7);
                res.status(500).json({ message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
