const express = require('express');
const router = express.Router();

const controllerItems = require('../controllers/items');

const guard = require('../helpers/guard');

router
  .get('/', guard, controllerItems.getAll)
  .post('/', guard, controllerItems.create)
  .delete('/:itemId', guard, controllerItems.remove)
  .patch('/:itemId', guard, controllerItems.update);

module.exports = router;
