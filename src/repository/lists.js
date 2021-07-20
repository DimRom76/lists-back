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
    { limit = 50, page = 1, sortBy = 'name', sortByDesk, filter, completed }
  ) {
    const result = await this.model.paginate(
      { owner: userId, ...(completed ? { completed } : {}) },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {})
        },
        select: '_id | isCompleted | name | createdAt | items',
        //select: filter ? filter.split('|').join(' ') : '',
        populate: { path: 'items.item', select: 'name' }
      }
    );
    return result;
  }

  async getById(userId, id) {
    const result = await this.model
      .findOne({ owner: userId, _id: id })
      .select('_id | isCompleted | name | createdAt | items')
      .populate({ path: 'items.item', select: 'name ' });
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
      .select('_id | isCompleted | name | createdAt | items')
      .populate({ path: 'items.item', select: 'name ' });
    return result;
  }

  async checkList(userId, id) {
    const currentList = await this.getById(userId, id);

    if (currentList) {
      currentList.isCompleted = !currentList.isCompleted;
      for (let index = 0; index < currentList.items.length; ++index) {
        currentList.items[index].isCompletedItem = currentList.isCompleted;
      }
      await currentList.save();
    }

    return currentList;
  }

  async addItem(userId, id, body) {
    // const result = await this.model
    //   .findOneAndUpdate(
    //     { owner: userId, _id: id, 'items.item': { $ne: body.item } },
    //     { $push: { items: body } },
    //     { new: true }
    //   )
    //   .select('_id | isCompleted | name | createdAt | items')
    //   .populate({ path: 'items.item', select: 'name ' });

    // // function (err, setdocs) {

    // //   //if there is no match then push a new subdocument
    // //   if (setdocs == null) {
    // //     User.findByIdAndUpdate(req.user._id, fieldsToPush, function (err, pushdocs) {
    // //      //...
    // //     });
    // //   }
    // //   else {
    // //     //....
    // //   }
    // // }

    // return result;

    // let currentList = await this.findByIdAndUpdate({
    //   owner: userId,
    //   _id: id,
    //   items: { item: { $ne: id } }
    // });

    let currentList = await this.getById(userId, id);

    if (currentList) {
      const item = currentList.items.find(el => {
        return String(el.item._id) === String(body.item);
      });

      if (item === undefined) {
        currentList.items.push(body);
        await currentList.save();

        currentList = await this.getById(userId, id);
      }
    }

    return currentList;
  }

  async checkItem(userId, id, body) {
    let currentList = await this.getById(userId, id);

    if (currentList) {
      const itemIndex = currentList.items.findIndex(el => {
        return String(el._id) === String(body._id);
      });

      if (itemIndex === -1) {
        return currentList;
      }
      currentList.items[itemIndex].isCompletedItem = !currentList.items[
        itemIndex
      ].isCompletedItem;
      await currentList.save();
    }

    return currentList;
  }

  async deleteItem(userId, id, body) {
    // const result = await this.model.findByIdAndRemove({
    //   owner: userId,
    //   _id: id,
    //   'items._id': body._id
    // });

    const currentList = await this.getById(userId, id);
    console.log(body);
    if (currentList) {
      const index = currentList.items.findIndex(el => {
        return el._id.toString() === body._id;
      });
      if (index !== -1) {
        currentList.items.splice(index, 1);
        await currentList.save();
      }
    }

    return currentList;
  }

  async remove(userId, id) {
    const result = await this.model.findByIdAndRemove({
      owner: userId,
      _id: id
    });
    return result;
  }
}

module.exports = ListsRepository;
