import { Router } from 'express';
import { notifyNewOrder } from '../controllers/orders.controller';

const router = Router();

// POST /api/orders/notify
router.post('/notify', notifyNewOrder);

export default router;
