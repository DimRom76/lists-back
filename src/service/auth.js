const jwt = require('jsonwebtoken');
const { UsersRepository } = require('../repository');

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
  constructor() {
    this.repositories = { users: new UsersRepository() };
  }

  async login({ email, password }) {
    const user = await this.repositories.users.findByField({ email });

    const res = await user.validPassword(password).then(result => {
      return result;
    });

    if (!user || !res || !user.isVerify) return null;

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '4h' });
    await this.repositories.users.updateFields(id, { token });

    const { name, avatarURL } = user;

    return { token, name, avatarURL };
  }

  async logout(id) {
    const data = await this.repositories.users.updateFields(id, {
      token: null,
    });
    return data;
  }
}

module.exports = AuthService;
