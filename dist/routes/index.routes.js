"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
router.get('/', (req, res) => {
    res.json('All good in here');
});
module.exports = router;
