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
    { limit = 50, page = 1, sortBy = 'name', sortByDesk, filter, completed },
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
        select: '_id | isCompleted | name | createdAt | items',
        //select: filter ? filter.split('|').join(' ') : '',
        populate: { path: 'items.item', select: 'name' },
      },
    );
    return result;
  }

  async getById(userId, id) {
    const result = await this.model
      .findOne({ owner: userId, _id: id })
      .select('_id | isCompleted | name | createdAt | items')
      .populate({ path: 'owner', select: 'email name -_id' });
    return result;
  }

  async create(userId, body) {
    const result = await this.model.create({ ...body, owner: userId });
    const { _id, isCompleted, name, createdAt, items } = result;
    return { _id, isCompleted, name, createdAt, items };
  }

  async update(userId, id, body) {
    const result = await this.model
      .findByIdAndUpdate({ owner: userId, _id: id }, { ...body }, { new: true })
      .select('_id | isCompleted | name | createdAt | items');
    return result;
  }

  async addItem(userId, id, body) {
    const currentList = await this.model.findById(
      { owner: userId, _id: id },
      // { $push: { items: { $each: body.idItem } } },
      // { new: true },
    );

    if (currentList) {
      const item = currentList.items.find(el => {
        return el.item.toString() === body.item;
      });

      if (item === undefined) {
        currentList.items.push(body);
        currentList.save();
      }
    }

    return currentList;
  }

  async deleteItem(userId, id, body) {
    const currentList = await this.model.findById(
      { owner: userId, _id: id },
      // { $push: { items: { $each: body.idItem } } },
      // { new: true },
    );

    if (currentList) {
      const index = currentList.items.findIndex(el => {
        return el.item.toString() === body.item;
      });
      if (index !== -1) {
        currentList.items.splice(index, 1);
        currentList.save();
      }
    }

    return currentList;
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
