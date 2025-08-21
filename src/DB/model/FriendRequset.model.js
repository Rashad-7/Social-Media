import mongoose, { Types } from 'mongoose';

const { Schema, model } = mongoose;

const FriendRequestSchema = new Schema({
   friendId:{type:Types.ObjectId,ref:"User",require:true},
   createdBy:{type:Types.ObjectId,ref:"User",require:true}

//    , sender: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
    // receiver: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    ,
    status: {
        type: Boolean,
        // enum: ['pending', 'accepted', 'rejected'],
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

export const FriendRequestModel=mongoose.model.FriendRequest||model('FriendRequest', FriendRequestSchema);