# 🧹 Steam Dota 2 Guide Cleaner

> **I got tired of unsubscribing from 1000 Dota 2 guides manually after 20 years of playing. So I made a script.**

If you've played Dota 2 for years, there's a good chance your Steam guide subscriptions are full of hundreds or even thousands of old guides.

And Steam's solution is basically:

**Unsubscribe → next → unsubscribe → next → unsubscribe...**

No thanks. 😄

So I made **Steam Dota 2 Guide Cleaner** — a small Tampermonkey userscript that does the boring part for you.

## ✨ What it does

- 🧹 Finds your subscribed Dota 2 guides
- ⚡ Unsubscribes from them in batches
- 📊 Shows progress
- 🔄 Reloads the page and keeps going
- 🔍 Checks when there are no subscriptions left
- 🛑 Stops automatically when the list is empty
- ⏱️ Lets you control the speed
- 🚦 Handles temporary Steam rate limits
- 💾 Remembers your speed settings

## 🔒 You are in control

The script **does nothing after installation**.

You have to press:

> **▶ START CLEANUP**

Then confirm the action.

Only after that will it start unsubscribing.

You can also press **STOP** at any time to stop sending new requests.

## ⚠️ Important

This tool is for **mass-unsubscribing** from Dota 2 guides.

Unsubscribing is not automatically reversible by the script, so make sure you really want to clean your subscriptions before starting.

## 📦 Installation

1. Install **Tampermonkey**.
2. Open the userscript and install it.
3. Open your Steam Dota 2 guide subscriptions.
4. Press **START CLEANUP** and confirm.

**[👉 Install the script](https://raw.githubusercontent.com/Ga4iGnida/steam-dota-guide-cleaner/main/steam-dota-guide-cleaner.user.js)**

## ⚙️ Speed

You can adjust:

- **Parallel requests:** 1–10
- **Delay:** 0–2000 ms

A good starting point is **5 parallel requests + 50 ms delay**.

If Steam starts limiting requests, the script automatically waits and retries.

## 🤷 Why?

Because sometimes you just want to clean up your old subscriptions.

Steam says:

> “You have 1000 guides. Unsubscribe manually.”

And you think:

**“Why the fuck should I?”**

That's literally why this project exists.

It's just a small script that saves you from hours of pointless clicking.

## 📜 License

MIT License.

Use it, modify it, improve it.

---

# 🇷🇺 НА РУССКОМ:

> **Я рот ебал отписываться от 1000 руководств в Dota 2 вручную после 20 лет игры. Поэтому просто написал скрипт.**

Если ты играл в Dota 2 много лет, то наверняка в подписках Steam накопились сотни или даже тысячи старых руководств.

А Steam предлагает прекрасный выбор:

**Отписаться → следующее → отписаться → следующее → отписаться...**

Ну его нахуй. 😄

Поэтому я сделал **Steam Dota 2 Guide Cleaner** — небольшой Tampermonkey-скрипт, который делает эту скучную работу за тебя.

## ✨ Что он делает

- 🧹 Находит подписанные руководства Dota 2
- ⚡ Отписывается от них пачками
- 📊 Показывает прогресс
- 🔄 Обновляет страницу и продолжает работу
- 🔍 Проверяет, когда подписок больше не осталось
- 🛑 Сам останавливается, когда список пуст
- ⏱️ Позволяет настроить скорость
- 🚦 Обрабатывает временные ограничения Steam
- 💾 Запоминает настройки скорости

## 🔒 Всё под твоим контролем

После установки скрипт **ничего не делает сам**.

Нужно нажать:

> **▶ НАЧАТЬ ОЧИСТКУ**

После этого он попросит подтверждение.

Только после твоего согласия начинается отписка.

В любой момент можно нажать **ОСТАНОВИТЬ**, чтобы прекратить отправку новых запросов.

## ⚠️ Важно

Это инструмент для **массовой отмены подписок** на руководства Dota 2.

Скрипт не умеет автоматически возвращать отменённые подписки, поэтому перед запуском убедись, что действительно хочешь очистить список.

## 📦 Установка

1. Установи **Tampermonkey**.
2. Открой userscript и установи его.
3. Открой свои подписки на руководства Dota 2 в Steam.
4. Нажми **НАЧАТЬ ОЧИСТКУ** и подтверди действие.

**[👉 Установить скрипт](https://raw.githubusercontent.com/Ga4iGnida/steam-dota-guide-cleaner/main/steam-dota-guide-cleaner.user.js)**

## ⚙️ Скорость

Можно настроить:

- **Параллельные запросы:** 1–10
- **Задержка:** 0–2000 мс

Хорошая стартовая настройка — **5 параллельных запросов + 50 мс задержки**.

Если Steam начинает ограничивать запросы, скрипт сам подождёт и повторит попытку.

## 🤷 Зачем это вообще?

Потому что иногда просто хочется очистить старые подписки.

Steam говорит:

> «У тебя 1000 руководств. Отписывайся вручную.»

А ты думаешь:

**«А нахрена?»**

Вот поэтому этот проект и существует.

Это просто небольшой скрипт, который экономит несколько часов тупого кликанья.

## 📜 Лицензия

MIT License.

Используй, изменяй, улучшай.
