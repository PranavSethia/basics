const AssetService = require('../services/assetService');

const AssetController = {
  async create(req, res, next) {
    try {
      const asset = await AssetService.createAsset(req.body, req.user.id);
      res.status(201).json({ success: true, data: asset });
    } catch (err) { next(err); }
  },

  async getAll(req, res, next) {
    try {
      const data = await AssetService.getAssets(req.query);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const asset = await AssetService.getAssetById(req.params.id);
      if (!asset) return res.status(404).json({ success: false, error: 'Asset not found' });
      res.json({ success: true, data: asset });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const asset = await AssetService.updateAsset(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: asset });
    } catch (err) { next(err); }
  },

  async allocate(req, res, next) {
    try {
      const allocation = await AssetService.allocateAsset(req.body, req.user.id);
      res.status(201).json({ success: true, data: allocation });
    } catch (err) { next(err); }
  },

  async returnAsset(req, res, next) {
    try {
      const allocation = await AssetService.returnAsset(req.params.id, req.user.id);
      res.json({ success: true, data: allocation });
    } catch (err) { next(err); }
  },

  async getHistory(req, res, next) {
    try {
      const history = await AssetService.getAssetHistory(req.params.id);
      res.json({ success: true, data: history });
    } catch (err) { next(err); }
  },

  async getSummary(req, res, next) {
    try {
      const summary = await AssetService.getSummary();
      res.json({ success: true, data: summary });
    } catch (err) { next(err); }
  },
};

module.exports = AssetController;
