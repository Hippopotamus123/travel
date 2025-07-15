import express from 'express';
import { createPlan, getPlanById, getPlans } from '../controllers/plansController';

const router = express.Router();

router.post('/', createPlan);
router.get('/', getPlans);
router.get('/:id', getPlanById);

export default router;