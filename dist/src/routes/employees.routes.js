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
var express_1 = __importDefault(require("express"));
var Employee_model_1 = __importDefault(require("../models/Employee.model"));
var jwt_middleware_1 = require("../middleware/jwt.middleware");
var router = express_1.default.Router();
router
    .route('/')
    .get(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                        options: { sort: { name: 1 } },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Unauthorized' })];
                }
                return [2 /*return*/, res.status(200).json(user.employees)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Failed to retrieve employees.', error: error_1 })];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, phone, address, user, employee, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, address = _a.address;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'User not found.' })];
                }
                if (!name_1 || !email || !phone || !address) {
                    return [2 /*return*/, res.status(400).json({ message: 'Name, email, phone and address are required.' })];
                }
                employee = new Employee_model_1.default({ name: name_1, email: email, phone: phone, address: address });
                user.employees.push(employee._id);
                return [4 /*yield*/, Promise.all([employee.save(), user.save()])];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ message: 'Employee created successfully.' })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Failed to create employee.', error: error_2 })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router
    .route('/notes')
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, note, employeeId_1, user, employee, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, note = _a.note, employeeId_1 = _a.employeeId;
                if (note === '') {
                    return [2 /*return*/, res.status(400).json({ message: 'Note can not be empty.' })];
                }
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                        populate: {
                            path: 'notes',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_1.toString(); });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.notes.push(note);
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Note added successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.log(error_3);
                res.status(500).json({ message: 'Internal Server Error.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_2, index, note, user, employee, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, employeeId_2 = _a.employeeId, index = _a.index, note = _a.note;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_2; });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.notes[index] = note;
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Note updated successfully.' })];
            case 3:
                error_4 = _b.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_3, index, user, employee, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, employeeId_3 = _a.employeeId, index = _a.index;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_3; });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.notes.splice(index, 1);
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Note deleted successfully.' })];
            case 3:
                error_5 = _b.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router
    .route('/preferences')
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, shiftPreference, employeeId_4, user, employee, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, shiftPreference = _a.shiftPreference, employeeId_4 = _a.employeeId;
                if (shiftPreference === '') {
                    return [2 /*return*/, res.status(400).json({ message: 'Shift preference can not be empty.' })];
                }
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                        populate: {
                            path: 'shiftPreferences',
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_4.toString(); });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.shiftPreferences.push(shiftPreference);
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Shift preference added successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.log(error_6);
                res.status(500).json({ message: 'Internal Server Error.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_5, index, shiftPreference, user, employee, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, employeeId_5 = _a.employeeId, index = _a.index, shiftPreference = _a.shiftPreference;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_5; });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.shiftPreferences[index] = shiftPreference;
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Shift preference updated successfully.' })];
            case 3:
                error_7 = _b.sent();
                console.log(error_7);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_6, index, user, employee, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, employeeId_6 = _a.employeeId, index = _a.index;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_6; });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.shiftPreferences.splice(index, 1);
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Shift preference deleted successfully.' })];
            case 3:
                error_8 = _b.sent();
                console.log(error_8);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router
    .route('/vacation')
    .post(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_7, start, end, daysRemaining, daysPlanned, user, employee, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, employeeId_7 = _a.employeeId, start = _a.start, end = _a.end, daysRemaining = _a.daysRemaining, daysPlanned = _a.daysPlanned;
                if (daysPlanned < 1) {
                    return [2 /*return*/, res.status(400).json({ message: 'Days planned cannot be negative.' })];
                }
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_7.toString(); });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.vacations.push({ start: start, end: end });
                employee.vacationDays = daysRemaining;
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Vacation added successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_8, amount, user, employee, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, employeeId_8 = _a.employeeId, amount = _a.amount;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_8.toString(); });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.vacationDays = amount;
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Vacation amount updated successfully.' })];
            case 3:
                error_10 = _b.sent();
                console.log(error_10);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error.' })];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId_9, index, user, employee, vacation, millisecondsPerDay, totalDays, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, employeeId_9 = _a.employeeId, index = _a.index;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate({
                        path: 'employees',
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === employeeId_9; });
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                vacation = employee.vacations[index];
                millisecondsPerDay = 24 * 60 * 60 * 1000;
                totalDays = Math.ceil((vacation.end - vacation.start) / millisecondsPerDay) + 1;
                employee.vacations.splice(index, 1);
                employee.vacationDays += totalDays;
                return [4 /*yield*/, employee.save()];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Vacation deleted successfully.', totalDays: totalDays });
                return [3 /*break*/, 4];
            case 3:
                error_11 = _b.sent();
                console.log(error_11);
                res.status(500).json({ message: 'Failed to delete vacation.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router
    .route('/:id')
    .get(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, employee, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_model_1.default.findById(req.token._id).populate('employees')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                employee = user.employees.find(function (employee) { return employee._id.toString() === req.params.id; });
                return [2 /*return*/, res.status(200).json(employee)];
            case 2:
                error_12 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: 'Failed to retrieve employee.', error: error_12 })];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .put(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, email, phone, address, employee, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, name = _a.name, email = _a.email, phone = _a.phone, address = _a.address;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Employee_model_1.default.findById(id)];
            case 2:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ message: 'Employee not found.' })];
                }
                employee.name = name;
                employee.email = email;
                employee.phone = phone;
                employee.address = address;
                return [4 /*yield*/, employee.save()];
            case 3:
                _b.sent();
                res.status(200).json({ message: 'Employee updated successfully.' });
                return [3 /*break*/, 5];
            case 4:
                error_13 = _b.sent();
                console.log(error_13);
                res.status(500).json({ message: 'Failed to retrieve employee.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); })
    .delete(jwt_middleware_1.Authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, user, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id_1 = req.query.id;
                return [4 /*yield*/, User_model_1.default.findById(req.token._id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                return [4 /*yield*/, Employee_model_1.default.findByIdAndDelete(id_1)];
            case 2:
                _a.sent();
                user.employees = user.employees.filter(function (employeeId) { return employeeId.toString() !== id_1.toString(); });
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                res.status(200).json({ message: 'Employee deleted successfully.' });
                return [3 /*break*/, 5];
            case 4:
                error_14 = _a.sent();
                console.log(error_14);
                res.status(500).json({ message: 'Failed to delete employee.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
