const TypeORM = require('typeorm');
const {Message} = require('./model/Message');
// const MessageSchema = require('./entity/MessageSchema.js');

class BotCMSMessages {
    // constructor () {
    //     this.DB = {};
    // }

    initDB (target) {
        return next => () => {
            console.log('BOTCMS MESSAGES. DB INIT');
            // target.dbParams = target.dbParams || {};
            // target.dbParams.entities = target.dbParams.entities || [];
            // target.dbParams.entities.push(require('./entity/MessageSchema.js'));
            // target.dbParams.entities.push(MessageSchema);
            // target.dbParams.entities.push(__dirname + '/entity/*.js');
            // target.dbParams.entities.push(__dirname + '/entity/PostSchema.js');
            // target.dbParams.entities.push(process.cwd() + '/node_modules/botcms-messages/lib/entity/MessageSchema.js');
            // target.dbParams.entities.push('/home/mvoevodskiy/JSProjects/[BOTS]/testbot/node_modules/botcms-messages/lib/entity/MessageSchema.js');
            target.dbParams.entities.push(process.cwd() + '/node_modules/botcms-messages/lib/entity/*.js');
            const result = next();

            this.DB = target.DB;
            console.log('BOTCMS MESSAGES. DB INIT END');
            return result;
        }
    }

    failDB (target) {
        return next => error => {
            console.log('BOTCMS MESSAGES. DB FAIL. FATAL', error);
            process.exit(-1);
        }
    }

    handleUpdate (target) {
        return next => async ctx => {
            // console.log(target.DB);
            // console.log('BOTCMS MESSAGES. HANDLE UPDATE. MESSAGE: ', ctx.Message);

            let msgRepository = target.DB.getRepository('Message');
            let msg = new Message();
            return new Promise(function(resolve, reject) {
                msg.message_id = ctx.Message.id;
                msg.text = ctx.Message.text;
                msg.sender_id = ctx.Message.sender.id;
                msg.chat_id = ctx.Message.chat.id;
                msg.date = ctx.Message.date;
                msg.bridge = ctx.Bridge.name;
                msg.driver = ctx.Bridge.driverName;
                msg.attachments = JSON.stringify(ctx.Message.attachments);
                resolve()
            }).then( async () => {
                if (!target.T.empty(ctx.Message.reply.id)) {
                    console.log(ctx.Message.reply);
                    let replied = await msgRepository.findOne({
                        message_id: ctx.Message.reply.id,
                        bridge: ctx.Bridge.name,
                    });
                    console.log(replied);
                    return replied;
                } else {
                    return [];
                }
            }).then(replied => {
                console.log(replied);
                if (!target.T.empty(replied)) {
                    msg.replied_id = replied.id;
                }
            }).then(() => {
                console.log(msg);
                msgRepository.save(msg);
            }).then(() => next(ctx))
            // target.DB.manager.save(msg)
            //     .then(function(savedMessage) {
            //         console.log("Message has been saved: ", savedMessage);
            //         /*console.log("Now lets load all posts: ");
            //
            //         return msgRepository.find();*/
            //     })
            //     .then(function(allPosts) {
            //         // console.log("All posts: ", allPosts);
            //     });


            // console.log('BOTCMS MESSAGES. HANDLE UPDATE ENDED');
            // return next(ctx);
            // process.exit(-1);
        }
    }


}

module.exports = BotCMSMessages;
module.exports.Message = Message;