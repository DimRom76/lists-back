const { AuthService, UsersService } = require('../service');
const { HttpCode } = require('../helpers/constants');
const { getSuccesObject, getErrorObject } = require('./controllersFunction');

const serviseUser = new UsersService();
const serviseAuth = new AuthService();

const reg = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await serviseUser.findByEmail(email);
  if (user) {
    return next(
      getErrorObject(
        HttpCode.CONFLICT,
        'Conflict',
        'Email or password is wrong',
      ),
    );
  }
  try {
    const newUser = await serviseUser.create({
      name,
      email,
      password,
    });
    return res.status(HttpCode.CREATED).json(
      getSuccesObject(
        {
          email: newUser.email,
          name: newUser.name,
        },
        HttpCode.CREATED,
      ),
    );
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await serviseAuth.login({
      email,
      password,
    });
    if (user !== null) {
      const { token, name, avatarURL } = user;
      if (token) {
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          token,
          user: { email, name, avatarURL },
        });
      }
    }

    next(
      getErrorObject(
        HttpCode.UNAUTHORIZED,
        'Unauthorized',
        'Email or password is wrong',
      ),
    );
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await serviseAuth.logout(id);
    return res
      .status(HttpCode.NO_CONTENT)
      .json(getSuccesObject(null, HttpCode.NO_CONTENT));
  } catch (e) {
    next(
      getErrorObject(HttpCode.UNAUTHORIZED, 'Unauthorized', 'Not authorized'),
    );
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await serviseUser.update(id, req.body);
    if (user) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        user,
      });
    } else {
      return next(getErrorObject());
    }
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    const token = req.user.token;
    const user = await serviseUser.findByToken(token);
    if (user) {
      res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        user,
      });
    } else {
      return next(
        getErrorObject(HttpCode.UNAUTHORIZED, 'Unauthorized', 'Not authorized'),
      );
    }
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  const id = req.user.id;
  const pathFile = req.file.path;
  const url = await serviseUser.updateAvatar(id, pathFile);

  return res
    .status(HttpCode.OK)
    .json(getSuccesObject({ avatarURL: url }, HttpCode.OK));
};

const verify = async (req, res, next) => {
  try {
    const result = await serviseUser.verify(req.params);

    if (result) {
      res
        .status(HttpCode.OK)
        .json(getSuccesObject({ message: 'Verification successful' }));
    } else {
      return next(
        getErrorObject(HttpCode.NOT_FOUND, 'Not Found', 'User not found'),
      );
    }
  } catch (e) {
    next(e);
  }
};

module.exports = { reg, login, logout, update, current, avatars, verify };
