"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
function isAdmin(req, res, next) {
    if (!req.payload || !req.payload.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.payload.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
exports.isAdmin = isAdmin;
