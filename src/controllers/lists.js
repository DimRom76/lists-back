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
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        list,
      });
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
    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      list,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.remove(userId, req.params);
    if (list) {
      res.status(HttpCode.OK).json({
        status: 'success',
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
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        list,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const checkList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.checkList(userId, req.params);
    if (list) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        list,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.addItem(userId, req.params, req.body);
    if (list) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.CREATED,
        list,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const checkItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.checkItem(userId, req.params, req.body);
    if (list) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        list,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await listServise.deleteItem(userId, req.params, req.body);

    if (list) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        list,
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
  getById,
  create,
  checkList,
  remove,
  update,
  addItem,
  checkItem,
  deleteItem,
};
