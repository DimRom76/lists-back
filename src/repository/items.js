const Items = require('../schemas/items');
const Lists = require('../schemas/lists');

class ItemsRepository {
  constructor() {
    this.model = Items;
    this.modelList = Lists;
  }

  async getAll(userId, { limit = 50, page = 1, sortBy = 'name', sortByDesk }) {
    const result = await this.model.paginate(
      { owner: userId },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
        },
        select: '_id | isCompleted | name | createdAt ',
      },
    );
    return result;
  }

  async create(userId, body) {
    const result = await this.model.create({ ...body, owner: userId });
    const { _id, isCompleted, name, createdAt } = result;
    return { _id, isCompleted, name, createdAt };
  }

  async update(userId, id, body) {
    const result = await this.model
      .findByIdAndUpdate({ owner: userId, _id: id }, { ...body }, { new: true })
      .select('_id | isCompleted | name | createdAt ');
    return result;
  }

  async remove(userId, id) {
    const lists = await this.modelList.findOne({
      owner: userId,
      'items.item': id,
    });

    if (lists !== null) {
      return undefined;
    }

    const result = await this.model.findByIdAndRemove({
      owner: userId,
      _id: id,
    });

    return result;
  }
}

module.exports = ItemsRepository;
