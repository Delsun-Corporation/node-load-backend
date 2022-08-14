const express = require('express');
const { postLibraryList, addFavouriteLibrary, updateCommonLibrariesDetail } = require('../controllers/library/library.controller');
const router = express.Router();

// GET

// POST
router.post('/library-list', postLibraryList);
router.post('/create-update-common-library-detail', updateCommonLibrariesDetail);

// PUT
router.put('/library-set-favorite/:libraryId', addFavouriteLibrary);

module.exports = router;