import { Telegraf } from "telegraf";

// токен читаем из env
const bot = new Telegraf(process.env.BOT_TOKEN);

// ссылка на твой WebApp (Vercel)
const WEBAPP_URL = process.env.WEBAPP_URL || "https://mama-znaet-shop.vercel.app";
// куда пересылать заказы (ID чата менеджера)
const MANAGER_CHAT_ID = process.env.MANAGER_CHAT_ID || null;

bot.start((ctx) => {
  ctx.reply("Добро пожаловать 👋 Жми кнопку ниже, чтобы открыть каталог:", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "📦 Открыть каталог",
            web_app: { url: WEBAPP_URL }
          }
        ]
      ],
      resize_keyboard: true
    }
  });
});

// Ловим service message от WebApp: web_app_data
bot.on("message", async (ctx) => {
  try {
    // если пришли данные из WebApp
    if (ctx.message && ctx.message.web_app_data) {
      const data = ctx.message.web_app_data.data; // строка, которую прислал WebApp
      const from = ctx.from;
      const userInfo = `Пользователь: ${from.username ? "@" + from.username : from.first_name || from.id} (id:${from.id})`;
      const textToSend = `📥 *Новый заказ*\n${userInfo}\n\n${data}`;

      const targetChat = MANAGER_CHAT_ID || ctx.from.id; // если менеджер не указан — отправим автору

      // Отправляем менеджеру (формат Markdown)
      await bot.telegram.sendMessage(targetChat, textToSend, { parse_mode: "Markdown" });

      // Подтверждаем пользователю внутри WebApp (в чат)
      await ctx.reply("Спасибо! Заказ получен — менеджер свяжется с вами.");
    }
  } catch (err) {
    console.error("Ошибка при обработке web_app_data:", err);
  }
});

bot.launch().then(() => console.log("Bot started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
