const express = require('express');
const router = express.Router();
const postsController = require('../controller/postsConteoller');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/', handleErrorAsync(postsController.getPosts));

router.post('/', handleErrorAsync(postsController.addPost));

router.delete('/', handleErrorAsync(postsController.deletePostAll));

router.delete('/:id', handleErrorAsync(postsController.deletePostOne));

router.patch('/:id', handleErrorAsync(postsController.patchPost));

module.exports = router;