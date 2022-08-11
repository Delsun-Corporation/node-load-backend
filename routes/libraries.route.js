const express = require('express');
const { postLibraryList, addFavouriteLibrary } = require('../controllers/library/library.controller');
const router = express.Router();

// GET

// POST
router.post('/library-list', postLibraryList);

// PUT
router.put('/library-set-favorite/:libraryId', addFavouriteLibrary);

module.exports = router;