import Message from './models/chatMessage.models.js'

class ChatManager {

    getMessages = async () => {
        try {
            const messages = await Message.find();
            return messages;
        } catch (error) {
            console.log(error);
        }
    }

    addMessageToDB = async (message) => {
        try {
            await Message.create(message);
        } catch (error) {
            console.log(error);
        }
    }

    deleteAllMessages = async () => {
        try {
            await Message.deleteMany();
        } catch (error) {
            console.log(error);
        }
    }
}

export default ChatManager;

