module.exports = function(controller) {
    controller.on("hello, welcome_back", async (bot, message) => {
        await bot.reply(message, "Hello, I'm Winston, and I'm here to help you learn Pythagorean Theorem!")
    });
}