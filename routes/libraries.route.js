const express = require('express');
const { postLibraryList } = require('../controllers/library/library.controller');
const router = express.Router();

// GET

// POST
router.post('/library-list', postLibraryList);

module.exports = router;