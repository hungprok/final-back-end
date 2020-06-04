const router = require('express').Router();

const { createCate, updateCate, deleteCate, readCate } = require('../controllers/CateController');

router.route('/')
    .post(createCate)
    // .put(updateCate)
    .get(readCate)
// .delete(deleteCate)

module.exports = router;