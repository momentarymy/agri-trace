const traceService = require('../services/traceService');
const asyncHandler = require('../utils/asyncHandler');

exports.getTraceInfo = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  // Also support query param if needed, but route usually defines params
  const id = batchId || req.query.batchId || req.query.code; 
  
  if (!id) {
      res.status(400);
      throw new Error('Batch ID is required');
  }

  try {
    const data = await traceService.getTraceInfo(id);
    res.json(data);
  } catch (error) {
    if (error.message === 'Batch not found') {
      res.status(404);
    }
    throw error;
  }
});
