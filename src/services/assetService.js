const AssetRepository = require('../repositories/assetRepository');
const AuditRepository = require('../repositories/auditRepository');
const NotificationService = require('./notificationService');

const AssetService = {
  async createAsset(data, performedBy) {
    const asset = await AssetRepository.create(data);
    await AuditRepository.log({
      tableName: 'assets',
      actionType: 'INSERT',
      recordId: asset.id,
      oldData: null,
      newData: asset,
      performedBy,
    });
    return asset;
  },

  async getAssets(filters) {
    return AssetRepository.getAll(filters);
  },

  async getAssetById(id) {
    return AssetRepository.getById(id);
  },

  async updateAsset(id, data, performedBy) {
    const old = await AssetRepository.getById(id);
    const updated = await AssetRepository.update(id, data);
    await AuditRepository.log({
      tableName: 'assets',
      actionType: 'UPDATE',
      recordId: id,
      oldData: old,
      newData: updated,
      performedBy,
    });
    return updated;
  },

  async allocateAsset(data, performedBy) {
    const asset = await AssetRepository.getById(data.asset_id);
    if (!asset) throw { status: 404, message: 'Asset not found' };
    if (asset.status !== 'available') throw { status: 400, message: 'Asset is not available' };

    const allocation = await AssetRepository.allocate({ ...data, allocated_by: performedBy });

    await AuditRepository.log({
      tableName: 'asset_allocations',
      actionType: 'INSERT',
      recordId: allocation.id,
      oldData: null,
      newData: allocation,
      performedBy,
    });

    // Fire notification event
    await NotificationService.onAssetAssigned(data.employee_id, asset.asset_name);

    return allocation;
  },

  async returnAsset(allocationId, performedBy) {
    const allocation = await AssetRepository.returnAsset(allocationId, performedBy);
    const asset = await AssetRepository.getById(allocation.asset_id);

    await AuditRepository.log({
      tableName: 'asset_allocations',
      actionType: 'UPDATE',
      recordId: allocationId,
      oldData: { status: 'active' },
      newData: allocation,
      performedBy,
    });

    await NotificationService.onAssetReturned(allocation.employee_id, asset?.asset_name || 'Asset');
    return allocation;
  },

  async getAssetHistory(assetId) {
    return AssetRepository.getHistory(assetId);
  },

  async getSummary() {
    return AssetRepository.getSummary();
  },
};

module.exports = AssetService;
