import { showErrorNotification } from '../utils/notifications';

const TELEGRAM_BOT_TOKEN = '6988387557:AAFxGGBPGxGPGxGPGxGPGxGPGxGPGxGPGxG';
const TELEGRAM_CHAT_ID = '-1001234567890';

export const sendTelegramNotification = async (message: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification');
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    showErrorNotification('Ошибка при отправке уведомления в Telegram');
    return false;
  }
};

export const formatTransactionMessage = (
  fromUser: string,
  toUser: string,
  amount: number,
  description: string,
  type: 'income' | 'expense',
  waybillNumber?: string
): string => {
  const emoji = type === 'income' ? '🟢' : '🔴';
  const formattedAmount = amount.toLocaleString('ru-RU');
  const waybillLink = waybillNumber ? `\nНакладная: <a href="https://hotwell.kz/documents/${waybillNumber}">№${waybillNumber}</a>` : '';

  return `
${emoji} <b>Расчет по Чекам HotWell.KZ</b>

От: ${fromUser}
Кому: ${toUser}
Сумма: <b>${formattedAmount} ₸</b>
Примечание: ${description}${waybillLink}
  `.trim();
};