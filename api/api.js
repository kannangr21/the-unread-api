const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

const accounts = require('./accounts/accounts');
const sockets = require('./sockets/sockets');
router.use('/accounts/', accounts);
router.use('/sockets/',sockets);

module.exports = router;