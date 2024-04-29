const express = require('express');
const controller = require('../controllers/artController');
const offerRoutes = require('./offerRoutes');
const router = express.Router();
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const { validateId, validateArtwork, validateResults} = require('../middleware/validator');

//Get /artworks: send all artworks to the user
router.get('/', controller.index);

// GET /artworks/new: send html form for creating a new art
router.get('/new',isLoggedIn, controller.new);

//POST /artworks: create a new art
router.post('/', upload, isLoggedIn, validateArtwork, validateResults, controller.create);

// Middleware to validate ID for routes with ID parameter
router.use('/:id', validateId);

//GET /artworks/:id send details of art identified by id 
router.get('/:id', controller.show);

//GET /artworks/:id/edit send html form for editing an existing art
router.get('/:id/edit', isLoggedIn, isSeller, controller.edit);

//PUT /artworks/:id: update the art identified by id
router.put('/:id', upload, isLoggedIn, isSeller, controller.update);

//DELETE /artworks/:id delete the art identified by id 
router.delete('/:id', isLoggedIn, isSeller, controller.delete);

router.use('/:id', offerRoutes);

module.exports = router;