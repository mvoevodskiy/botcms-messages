const TypeORM = require('typeorm');
const {Message} = require('./model/Message');
// const MessageSchema = require('./entity/MessageSchema.js');

class BotCMSMessages {

    initDB (target) {
        return next => () => {
            console.log('BOTCMS MESSAGES. DB INIT');
            // console.log('BOTCMS MESSAGES. ENTITIES', target.dbParams.entities);
            target.dbParams.entities.push(process.cwd() + '/node_modules/botcms-messages/lib/entity/*.js');
            // console.log('BOTCMS MESSAGES. ENTITIES', target.dbParams.entities);
            const result = next();

            // this.DB = target.DB;
            console.log('BOTCMS MESSAGES. DB INIT END');
            return result;
        }
    }

    successDB (target) {
        return next => () => {
            console.log('BOTCMS MESSAGES. DB INIT SUCCESS');
            this.DB = target.DB;
            return next();
        }
    }

    failDB (target) {
        return next => error => {
            console.error('BOTCMS MESSAGES. DB FAIL. FATAL');
            console.error(error);
            process.exit(-1);
        }
    }

    handleUpdate (target) {
        return next => async ctx => {
            // console.log(target.DB);
            // console.log('BOTCMS MESSAGES. HANDLE UPDATE. MESSAGE: ', ctx.Message);

            let msgRepository = this.DB.getRepository('Message');
            let msg = new Message();
            // return new Promise(function(resolve, reject) {
                msg.message_id = ctx.Message.id;
                msg.text = ctx.Message.text;
                msg.sender_id = ctx.Message.sender.id;
                msg.chat_id = ctx.Message.chat.id;
                msg.date = ctx.Message.date;
                msg.bridge = ctx.Bridge.name;
                msg.driver = ctx.Bridge.driverName;
                msg.attachments = JSON.stringify(ctx.Message.attachments);
            //     resolve()
            // }).then( async () => {
            let replied = [];
                if (!target.T.empty(ctx.Message.reply.id)) {
                    console.log(ctx.Message.reply);
                    replied = await msgRepository.findOne({
                        message_id: ctx.Message.reply.id,
                        bridge: ctx.Bridge.name,
                    });
                    console.log(replied);
            //         return replied;
            //     } else {
            //         return [];
                }
            // }).then(replied => {
            //     console.log(replied);
                if (!target.T.empty(replied)) {
                    msg.replied_id = replied.id;
                }
            // }).then(() => {
                console.log(msg);
                msgRepository.save(msg);
            // }).then(() => next(ctx))
            // target.DB.manager.save(msg)
            //     .then(function(savedMessage) {
            //         console.log("Message has been saved: ", savedMessage);
            //         /*console.log("Now lets load all posts: ");
            //
            //         return msgAggrRepository.find();*/
            //     })
            //     .then(function(allPosts) {
            //         // console.log("All posts: ", allPosts);
            //     });


            // console.log('BOTCMS MESSAGES. HANDLE UPDATE ENDED');
            return next(ctx);
            // process.exit(-1);
        }
    }


}

module.exports = BotCMSMessages;
// module.exports.Message = Message;