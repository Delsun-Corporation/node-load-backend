const express = require('express');
const { postLibraryList, addFavouriteLibrary, updateCommonLibrariesDetail, addCustomLibraries, deleteLibrary, updateCustomLibraries } = require('../controllers/library/library.controller');
const router = express.Router();

// DELETE
router.delete('/library-delete/:libraryId', deleteLibrary);

// POST
router.post('/library-list', postLibraryList);
router.post('/create-update-common-library-detail', updateCommonLibrariesDetail);
router.post('/library-create', addCustomLibraries);

// PUT
router.put('/library-set-favorite/:libraryId', addFavouriteLibrary);
router.put('/library-update/:libraryId', updateCustomLibraries);

module.exports = router;