/**
 * Quick test script for Telegram bot
 * Run: npx ts-node src/scripts/test-telegram.ts
 */
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('🔍 Checking environment...');
console.log('TELEGRAM_BOT_TOKEN:', token ? `✅ Set (${token.slice(0, 10)}...)` : '❌ MISSING');
console.log('TELEGRAM_CHAT_ID:', chatId ? `✅ Set (${chatId})` : '❌ MISSING');

if (!token || !chatId) {
  console.error('\n❌ Missing credentials. Check your .env file.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });

(async () => {
  try {
    console.log('\n📡 Sending test message to Telegram...');
    await bot.sendMessage(chatId, '✅ *Test message from AntiGravity backend!*\nTelegram notifications are working correctly.', {
      parse_mode: 'Markdown',
    });
    console.log('✅ SUCCESS! Message sent. Check your Telegram.');
  } catch (err: any) {
    console.error('\n❌ FAILED to send message:', err?.message || err);
    if (err?.response?.body) {
      console.error('Telegram API error:', JSON.stringify(err.response.body, null, 2));
    }
    console.log('\n💡 Common causes:');
    console.log('  - Bot token is wrong → re-copy from @BotFather');
    console.log('  - Chat ID is wrong → go to https://api.telegram.org/bot<TOKEN>/getUpdates');
    console.log('  - You never messaged the bot first → send /start to your bot first');
  }
})();
