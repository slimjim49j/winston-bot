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
        await bot.reply(message, {
            type: "draw",
            draw: [
                {
                    "type": "label",
                    "text": "Use your mouse to pan, scroll to zoom",
                    "pos": [200, 80, 0],
                    "parent": ""
                },
                {
                    "type": "label",
                    "text": "Pythagorean Thoerem",
                    "pos": [200, 60, 0],
                    "parent": ""
                },
            ]
        })
    });
}