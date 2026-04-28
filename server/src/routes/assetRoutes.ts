import { Router } from 'express';
import { AssetController } from '../controllers/AssetController';

const router = Router();
const controller = new AssetController();

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.get('/:id', controller.getById);
router.get('/:id/history', controller.getPriceHistory);
router.post('/seed', controller.seedMarketData);

export default router;
