const Farmland = require('../models/Farmland');
const User = require('../models/User');

class FarmlandService {
  async getAll(user) {
    const where = user.role === 'farmer' ? { owner_id: user.id } : {};
    
    return await Farmland.findAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['username'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async create(data, userId) {
    return await Farmland.create({
      ...data,
      owner_id: userId
    });
  }

  async delete(id, user) {
    const farmland = await Farmland.findByPk(id);
    if (!farmland) {
      throw new Error('地块不存在');
    }

    if (user.role !== 'admin' && farmland.owner_id !== user.id) {
      throw new Error('无权删除此地块');
    }

    await farmland.destroy();
  }
}

module.exports = new FarmlandService();
