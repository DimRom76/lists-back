const express = require('express');
const router = express.Router();

const controllerLists = require('../controllers/lists');

const guard = require('../helpers/guard');

router
  .get('/', guard, controllerLists.getAll)
  .get('/:listId', guard, controllerLists.getById)
  .post('/', guard, controllerLists.create)
  .delete('/:listId', guard, controllerLists.remove)
  .patch('/:listId', guard, controllerLists.update)
  .patch('/:listId/addItem', guard, controllerLists.addItem)
  .patch('/:listId/deleteItem', guard, controllerLists.deleteItem);

module.exports = router;
