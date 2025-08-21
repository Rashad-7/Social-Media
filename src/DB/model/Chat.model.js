import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ChatSchema = new Schema({
    mainUser: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    , subParticipant: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

    messages: [
        {
        message:{type:String,require:true},
        senderId:{ type: Schema.Types.ObjectId,ref:"User",require:true}
        
        }
    ]
},{timestamps:true});
export const chatModel= mongoose.models.Chat || model('Chat',ChatSchema)
