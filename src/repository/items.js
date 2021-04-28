const Items = require('../schemas/items');

class ItemsRepository {
  constructor() {
    this.model = Items;
  }

  async getAll(userId, { limit = 5, page = 1, sortBy, sortByDesk }) {
    const result = await this.model.paginate(
      { owner: userId },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
        },
      },
    );
    return result;
  }

  async create(userId, body) {
    const result = await this.model.create({ ...body, owner: userId });
    return result;
  }

  async update(userId, id, body) {
    const result = await this.model.findByIdAndUpdate(
      { owner: userId, _id: id },
      { ...body },
      { new: true },
    );
    return result;
  }

  async remove(userId, id) {
    const result = await this.model.findByIdAndRemove({
      owner: userId,
      _id: id,
    });
    return result;
  }
}

module.exports = ItemsRepository;
