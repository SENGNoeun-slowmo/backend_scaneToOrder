import { Request, Response } from 'express';
import { sendOrderNotification } from '../services/telegram.service';

export const notifyNewOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, tableNumber, totalAmount, customerNote, timestamp, items } = req.body;

    if (!orderId || !items || !tableNumber) {
      return res.status(400).json({ error: 'orderId, tableNumber, and items are required' });
    }

    const formattedOrder = {
      id: orderId,
      tableNumber: String(tableNumber),
      totalAmount: Number(totalAmount) || 0,
      customerNote: customerNote || '',
      timestamp: timestamp || new Date().toISOString(),
      items: items.map((item: any) => ({
        name: item.name || 'Unknown Item',
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
      })),
    };

    await sendOrderNotification(formattedOrder);
    console.log('✅ Telegram notification sent for order:', orderId);

    return res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('❌ notifyNewOrder error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
