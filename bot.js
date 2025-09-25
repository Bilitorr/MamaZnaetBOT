import express from "express";
import { Telegraf } from "telegraf";

const app = express();

// переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined");
}

const bot = new Telegraf(BOT_TOKEN);

// Кнопка запуска мини-аппа
bot.start((ctx) =>
  ctx.reply("Привет! 👋", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Открыть каталог 🛒", web_app: { url: WEBAPP_URL } }]
      ]
    }
  })
);

// Запуск бота
bot.launch().then(() => {
  console.log("✅ Bot started and running on Render");
});

// Чтобы Render не ругался на отсутствие порта
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Mama Znaet Bot is running..."));
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
