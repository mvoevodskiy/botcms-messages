const {BaseEntity, Entity, PrimaryGeneratedColumn, Column} = require("typeorm");
/*export */ class Message /*extends BaseEntity*/ {

    constructor(id, message_id, text, attachments, bridge, sender_id, replied_id, chat_id, driver, date) {
        // super();
        this.id = id;
        this.message_id = message_id;
        this.text = text;
        this.attachments = attachments;
        this.bridge = bridge;
        this.sender_id = sender_id;
        this.replied_id = replied_id;
        this.chat_id = chat_id;
        this.driver = driver;
        this.date = date;
    }
}

module.exports = {
    Message: Message
};