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
var express_1 = __importDefault(require("express"));
var WorkDay_model_1 = __importDefault(require("../models/WorkDay.model"));
var Employee_model_1 = __importDefault(require("../models/Employee.model"));
var jwt_middleware_1 = require("../middleware/jwt.middleware");
var router = express_1.default.Router();
router.route('/').post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, data, hasShifts, user, employee, _loop_1, _i, data_1, _b, date, start, end, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, id = _a.id, data = _a.data;
                if (data.length < 1) {
                    return [2 /*return*/, res.status(404).json({ message: 'Please select a month.' })];
                }
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ message: 'Please select an employee.' })];
                }
                hasShifts = data.some(function (shift) { return shift.start && shift.end; });
                if (!hasShifts) {
                    return [2 /*return*/, res.status(400).json({ message: 'Please make at least one shift.' })];
                }
                return [4 /*yield*/, User_model_1.default.findOne({ _id: req.token._id })];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                return [4 /*yield*/, Employee_model_1.default.findById(id)];
            case 2:
                employee = _c.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found' })];
                }
                _loop_1 = function (date, start, end) {
                    var modifiedDate, midnightUnixCode, workDay, shift;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                modifiedDate = new Date(date * 1000);
                                modifiedDate.setHours(0, 0, 0, 0);
                                midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);
                                return [4 /*yield*/, WorkDay_model_1.default.findOne({ date: midnightUnixCode, user: req.token._id })];
                            case 1:
                                workDay = _d.sent();
                                if (!!workDay) return [3 /*break*/, 3];
                                return [4 /*yield*/, WorkDay_model_1.default.create({ date: midnightUnixCode, user: req.token._id })];
                            case 2:
                                workDay = _d.sent();
                                _d.label = 3;
                            case 3:
                                if (!!user.workDays.some(function (workDayId) { return workDayId.equals(workDay === null || workDay === void 0 ? void 0 : workDay._id); })) return [3 /*break*/, 5];
                                user.workDays.push(workDay._id);
                                return [4 /*yield*/, user.save()];
                            case 4:
                                _d.sent();
                                _d.label = 5;
                            case 5:
                                if (!start || !end) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, Shift_model_1.default.findOne({ employee: employee, workDay: workDay })];
                            case 6:
                                shift = _d.sent();
                                if (!!shift) return [3 /*break*/, 8];
                                return [4 /*yield*/, Shift_model_1.default.create({ employee: employee, workDay: workDay, start: start, end: end })];
                            case 7:
                                shift = _d.sent();
                                _d.label = 8;
                            case 8:
                                shift.end = end;
                                shift.start = start;
                                if (!workDay.shifts.some(function (shiftId) { return shiftId.equals(shift === null || shift === void 0 ? void 0 : shift._id); })) {
                                    workDay.shifts.push(shift._id);
                                }
                                return [4 /*yield*/, Promise.all([shift.save(), workDay.save(), user.save()])];
                            case 9:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, data_1 = data;
                _c.label = 3;
            case 3:
                if (!(_i < data_1.length)) return [3 /*break*/, 6];
                _b = data_1[_i], date = _b.date, start = _b.start, end = _b.end;
                return [5 /*yield**/, _loop_1(date, start, end)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, res.status(201).json({ message: 'Roster Created' })];
            case 7:
                error_1 = _c.sent();
                console.log(error_1);
                res.status(500).json({ message: 'Error creating the roster' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
