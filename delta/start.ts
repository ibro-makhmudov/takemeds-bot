import { Composer, Keyboard } from "../deps.ts";

const composer = new Composer();

export const message =
    "Welcome, everynyan~ \nI'm a bot that reminds you to take your meds.";

const keyboard = new Keyboard()
    .text("Add a medication 💊").row()
    .text("View your meds").row()
    .text("Help")
    .resized();

composer.command("start", async (ctx) => {
    await ctx.reply(message, {
        reply_markup: keyboard
    });
});

export default composer;