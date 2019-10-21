import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message_id: "varchar";

    @Column()
    text: "mediumtext";

    @Column()
    attachments: "mediumtext";

    @Column()
    bridge: "varchar";

    @Column()
    sender_id: "varchar";

    @Column()
    replied_id: number;

    @Column()
    chat_id: "varchar";

    @Column()
    driver: "varchar";

    @Column()
    date: "int";

}