import mongoose from "mongoose";

const messageCollection = 'messages';

const messagesSchema = mongoose.Schema({
    user: String,
    message: String
})

const Message = mongoose.model(messageCollection, messagesSchema);

export default Message;