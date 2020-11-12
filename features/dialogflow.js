const dialogflow = require('@google-cloud/dialogflow');
const service = require('../keys.json');
const { project_id: projectId } = service;
const sessionId = Math.floor(Math.random() * 10000).toString();
const responses = require("../data/responses.json");

// const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId, sessionId, message) {
    // A unique identifier for the given session
    // const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: message,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const results = await sessionClient.detectIntent(request);
    // console.log('Detected intent');
    // const result = results[0].queryResult;
    // console.log(`  Query: ${result.queryText}`);
    // console.log(`  Response: ${result.fulfillmentText}`);
    // if (result.intent) {
    //     console.log(`  Intent: ${result.intent.displayName}`);
    // } else {
    //     console.log(`  No intent matched.`);
    // }

    return results;
}

async function dialogflowMiddleware(bot, message, next) {
    if (message.type === "message") {
        await runSample(projectId, sessionId, message.text)
            .then(results => {
                const res = results[0].queryResult;

                message.dialogflow = {
                    intent: res.intent.displayName,
                    fulfillmentText: res.fulfillmentText,
                    action: res.action,
                    params: res.parameters.fields,
                };
            });
    }

    // call next, or else the message will be intercepted
    next();
}

async function reply(bot, message, res) {
    if (Array.isArray(res)) {
        // refact so recursive call on each reply
        res.forEach(async subRes => {
            debugger;
            await reply(bot, message, subRes)
        });

    } else if (typeof res === "object" && res !== null) {
        switch (res.type) {
            case "dynamic response":
                if ("key" in res) {
                    // example of what inside of params could look like:
                    // { mathterm: { stringValue: 'Triangle', kind: 'stringValue' } }
                    const prop = params[res.key];
                    await reply(bot, message, res[prop[prop.kind]]);
                }
                break;
            case "draw":
                await bot.reply(message, res);
                break;
            case "random":
                if ("replies" in res) {
                    const idx = Math.floor(Math.random() * res.replies.length);
                    await reply(bot, message, res.replies[idx]);
                }
                break;
            case "step":
                
        }
    } else {
        debugger;
        await bot.reply(message, res);
    }
}

module.exports = function (controller) {
    controller.middleware.ingest.use(dialogflowMiddleware);

    controller.on("message", async (bot, message) => {
        const { intent, fulfillmentText, action, params } = message.dialogflow;

        let res = responses[intent];
        
        if (res) {
            reply(bot, message, res);
        }

        if (intent === "Default Welcome Intent" || action.includes("smalltalk")) {
            await bot.reply(message, fulfillmentText);
        }

        // await bot.reply(message, {
        //     html: "",
        //     text: "##*Jimmy's message: boo*",
        //     type: "teach",
        //     draw: {
        //         nest: "egg",
        //     }
        // });
    })
}

