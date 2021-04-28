const { HttpCode } = require('../helpers/constants');
const { ListsService } = require('../service');
const { getSuccesObject, getErrorObject } = require('./controllersFunction');
const listServise = new ListsService();

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const lists = await listServise.getAll(userId, req.query);
    res.status(HttpCode.OK).json(getSuccesObject({ ...lists }, HttpCode.OK));
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.getById(userId, req.params);
    if (list) {
      res.status(HttpCode.OK).json(getSuccesObject(list, HttpCode.OK));
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.create(userId, req.body);
    res.status(HttpCode.CREATED).json(getSuccesObject(list, HttpCode.CREATED));
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.remove(userId, req.params);
    //TODO удалить в listElements
    if (list) {
      res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        message: 'list deleted',
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
    const list = await listServise.update(userId, req.params, req.body);
    if (list) {
      res.status(HttpCode.OK).json(getSuccesObject(list));
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};
