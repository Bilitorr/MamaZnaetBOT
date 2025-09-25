import { Telegraf } from "telegraf";

// читаем токен и URL из переменных окружения Render
const bot = new Telegraf(process.env.BOT_TOKEN);
const webAppUrl = process.env.WEBAPP_URL || "https://mama-znaet-shop.vercel.app";

// Команда /start
bot.start((ctx) => {
  ctx.reply(
    "Салам 👋 Добро пожаловать в магазин Mama Znaet!\nЖми кнопку ниже, чтобы открыть каталог:",
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "📦 Открыть каталог",
              web_app: { url: webAppUrl }
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    }
  );
});

// Ловим данные из веб-приложения (если потом добавим оформление заказов)
bot.on("message", (ctx) => {
  if (ctx.message.web_app_data) {
    console.log("Данные из webapp:", ctx.message.web_app_data.data);
    ctx.reply("✅ Спасибо, заказ принят!");
  }
});

bot.launch();

// Аккуратно гасим бот при остановке контейнера
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
