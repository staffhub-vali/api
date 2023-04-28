"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    app.use((req, res) => {
        res.status(404).json({ message: 'This route does not exist' });
    });
    app.use((err, req, res) => {
        console.error('ERROR', req.method, req.path, err);
        if (err.status === 401) {
            res.status(401).json({ message: 'Token Expired' });
        }
        if (!res.headersSent) {
            res.status(500).json({
                message: 'Internal server error. Check the server console',
            });
        }
    });
};
