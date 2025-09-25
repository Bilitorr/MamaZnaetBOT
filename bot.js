import { Telegraf } from "telegraf";
import express from "express";

// читаем переменные окружения
const bot = new Telegraf(process.env.BOT_TOKEN);
const webAppUrl = process.env.WEBAPP_URL || "https://mama-znaet-shop.vercel.app";

// /start
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
        resize_keyboard: true
      }
    }
  );
});

// Ловим данные из webapp (если потом будет отправка заказов)
bot.on("message", (ctx) => {
  if (ctx.message.web_app_data) {
    console.log("Данные из webapp:", ctx.message.web_app_data.data);
    ctx.reply("✅ Спасибо, заказ принят!");
  }
});

// Запускаем бота
bot.launch();

// ==== Хак для Render ====
// Создаём пустой веб-сервер, чтобы Render видел порт
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Mama Znaet Bot работает ✅");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// аккуратно останавливаем
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
