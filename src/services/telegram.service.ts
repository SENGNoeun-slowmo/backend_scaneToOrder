import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot: TelegramBot | null = null;

if (token && chatId) {
  // polling: false because we only send messages from this backend manually
  bot = new TelegramBot(token, { polling: false });
  console.log('✅ Telegram bot initialized.');
} else {
  console.warn('⚠️ Telegram credentials not found in .env. Bot features disabled.');
}
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderInfo {
  id: string;
  tableNumber: string;
  totalAmount: number;
  customerNote?: string;
  items: OrderItem[];
  timestamp: string;
}

export const sendOrderNotification = async (order: OrderInfo) => {
  if (!bot || !chatId) { 
    console.log('Telegram bot not configured. Skipping notification.');
    return;
  }


  try {
   
    const itemsList = order.items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)})${
            item.notes ? `\n  Note: ${item.notes}` : ''
          }`
      )
      .join('\n');

    const message = `
🛎️ *NEW ORDER ARRIVED* 🛎️

*Table:* ${order.tableNumber}
*Order ID:* \`${order.id.slice(0, 8)}\`
*Time:* ${new Date(order.timestamp).toLocaleString()}

*Items:*
${itemsList}

*Total:* $${order.totalAmount.toFixed(2)}
${order.customerNote ? `\n*Customer Note:* ${order.customerNote}` : ''}
`;

    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
};
