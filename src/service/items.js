const { ItemsRepository } = require('../repository');

class ItemsService {
  constructor() {
    this.repositories = { items: new ItemsRepository() };
  }

  async getAll(userId, query) {
    const data = await this.repositories.items.getAll(userId, query);
    //для каждого сервиса можно отдавать разные данные поэтому формат ответа формируем тут
    const { docs: items, totalDocs: total, limit, page } = data;

    return { items, total, limit, page };
  }

  async getById(userId, { itemId }) {
    const data = await this.repositories.items.getById(userId, itemId);
    return data;
  }

  async create(userId, body) {
    const data = await this.repositories.items.create(userId, body);
    return data;
  }

  async update(userId, { itemId }, body) {
    const data = await this.repositories.items.update(userId, itemId, body);
    return data;
  }

  async remove(userId, { itemId }) {
    const data = await this.repositories.items.remove(userId, itemId);
    return data;
  }
}

module.exports = ItemsService;
