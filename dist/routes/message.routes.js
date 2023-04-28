"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const Conversation = require('../models/Conversation.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
router.post('/conversation', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, recipientId, message } = req.body;
    console.log(req.body);
    try {
        const conversation = yield Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        }).populate('messages');
        if (conversation) {
            const newMessage = new Message({
                sender: senderId,
                recipient: recipientId,
                message,
            });
            console.log('Message Created.');
            conversation.messages.push(newMessage);
            yield Promise.all([newMessage.save(), conversation.save()]);
            res.status(200).json({ success: true, message: 'Message added to existing conversation' });
        }
        else {
            const sender = yield User.findById(senderId);
            const recipient = yield User.findById(recipientId);
            const newMessage = new Message({
                sender,
                recipient,
                message,
            });
            const newConversation = new Conversation({
                participants: [senderId, recipientId],
                messages: [newMessage],
            });
            sender.conversations.push(newConversation);
            recipient.conversations.push(newConversation);
            yield Promise.all([newMessage.save(), newConversation.save(), sender.save(), recipient.save()]);
            res.status(200).json({ success: true, message: 'Conversation created successfully' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create conversation' });
    }
}));
router.delete('/conversation', isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.query;
    const conversation = yield Conversation.findById(conversationId);
    const [userIdOne, userIdTwo] = conversation.participants;
    const userOne = yield User.findById(userIdOne);
    const userTwo = yield User.findById(userIdTwo);
    userOne.conversations = userOne.conversations.filter((conversation) => {
        return conversation.toString() !== conversationId;
    });
    userTwo.conversations = userTwo.conversations.filter((conversation) => {
        return conversation.toString() !== conversationId;
    });
    yield Promise.all([userOne.save(), userTwo.save(), Conversation.findByIdAndDelete(conversationId)]);
    res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
}));
module.exports = router;
