module.exports = function(controller) {
    controller.on("hello, welcome_back", async (bot, message) => {
        await bot.reply(message, {
            text: "Hello, I'm Winston, and I'm here to help you learn Pythagorean Theorem!",
            quick_replies: [
                {
                    title: "What's that?",
                    payload: "What's Pythagorean Theorem?",
                },
                {
                    title: "Pythagorean Theorem Uses",
                    payload: 'When would you use this?',
                },
                {
                    title: "Example",
                    payload: 'Could you show an example?',
                }
            ]
        });
    });
}