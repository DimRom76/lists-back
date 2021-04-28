const Lists = require('../schemas/lists');

class ListsRepository {
  constructor() {
    this.model = Lists;
  }

  //selectЖ : filter - фильтрация полей которые получим на выходе
  //populate - какие поля прикрепить от связанных документов
  //-_id - исключить из выборки

  async getAll(
    userId,
    { limit = 5, page = 1, sortBy, sortByDesk, filter, completed },
  ) {
    const result = await this.model.paginate(
      { owner: userId, ...(completed ? { completed } : {}) },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
        },
        //select: filter ? filter.split('|').join(' ') : '',
        //populate: { path: 'owner', select: 'email name -_id' },
      },
    );
    return result;
  }

  async getById(userId, id) {
    const result = await this.model
      .findOne({ owner: userId, _id: id })
      .populate({ path: 'owner', select: 'email name -_id' });
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

module.exports = ListsRepository;
