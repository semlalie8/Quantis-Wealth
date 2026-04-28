import { Router } from 'express';
import { PortfolioController } from '../controllers/PortfolioController';

const router = Router();
const controller = new PortfolioController();

// Portfolio CRUD
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// AI Optimization
router.post('/:id/optimize', controller.optimize);
router.get('/:id/risk-analysis', controller.riskAnalysis);
router.get('/:id/allocation-history', controller.allocationHistory);

export default router;
