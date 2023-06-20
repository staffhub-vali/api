"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var config_1 = __importDefault(require("config"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var connect_1 = __importDefault(require("./db/connect"));
dotenv_1.default.config();
var PORT = process.env.PORT || config_1.default.get('PORT');
var app = (0, express_1.default)();
var FRONTEND_URL = process.env.ORIGIN || config_1.default.get('ORIGIN');
var allowedOrigins = [FRONTEND_URL];
app.use((0, cors_1.default)({ origin: allowedOrigins }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/days', require('./routes/days.routes'));
app.use('/api/shifts', require('./routes/shift.routes'));
app.use('/api/roster', require('./routes/roster.routes'));
app.use('/api/employees', require('./routes/employees.routes'));
app.listen(PORT, function () {
    console.log("Server listing on port ".concat(PORT, "."));
    (0, connect_1.default)();
});
console.clear();
exports.default = app;
