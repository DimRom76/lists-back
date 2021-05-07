const { ListsRepository } = require('../repository');

class ListsService {
  constructor() {
    this.repositories = { lists: new ListsRepository() };
  }

  async getAll(userId, query) {
    const data = await this.repositories.lists.getAll(userId, query);
    //для каждого сервиса можно отдавать разные данные поэтому формат ответа формируем тут
    const { docs: lists, totalDocs: total, limit, page } = data;

    return { lists, total, limit, page };
  }

  async getById(userId, { listId }) {
    const data = await this.repositories.lists.getById(userId, listId);
    return data;
  }

  async create(userId, body) {
    const data = await this.repositories.lists.create(userId, body);
    return data;
  }

  async update(userId, { listId }, body) {
    const data = await this.repositories.lists.update(userId, listId, body);
    return data;
  }

  async checkList(userId, { listId }) {
    const data = await this.repositories.lists.checkList(userId, listId);
    return data;
  }

  async addItem(userId, { listId }, body) {
    const data = await this.repositories.lists.addItem(userId, listId, body);
    return data;
  }

  async checkItem(userId, { listId }, body) {
    const data = await this.repositories.lists.checkItem(userId, listId, body);
    return data;
  }

  async deleteItem(userId, { listId }, body) {
    const data = await this.repositories.lists.deleteItem(userId, listId, body);
    return data;
  }

  async remove(userId, { listId }) {
    const data = await this.repositories.lists.remove(userId, listId);
    return data;
  }
}

module.exports = ListsService;
