const { HttpCode } = require('../helpers/constants');
const { ItemsService } = require('../service');
const { getSuccesObject, getErrorObject } = require('./controllersFunction');
const itemsServise = new ItemsService();

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await itemsServise.getAll(userId, req.query);
    res.status(HttpCode.OK).json(getSuccesObject({ ...items }, HttpCode.OK));
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const item = await itemsServise.create(userId, req.body);
    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      item,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const item = await itemsServise.remove(userId, req.params);
    if (item) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'item deleted',
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const item = await itemsServise.update(userId, req.params, req.body);
    if (item) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        item,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  create,
  remove,
  update,
};
