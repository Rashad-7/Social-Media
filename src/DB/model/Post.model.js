import mongoose, { Schema,Types,model } from "mongoose"
const PostSchema = new Schema({
    content: {
        type: String,
        required:function() {
            console.log(this);
            return this.attachments?.length?   false : true;
        },
        minlength: 2,
        maxlength: 50000,
        trim: true
    },
    attachments: [{
        secure_url:String,
        public_id: String,}]
    ,
    createdBy: {
        type:Types.ObjectId,
        ref: 'User',
        required: true
    },  
    likes: [{
        type:Types.ObjectId,
        ref: 'User'
    }],
        likes: [{
        type:Types.ObjectId,
        ref: 'User'
    }],
    // comments: [{
    //     type:Types.ObjectId,
    //     ref: 'Comment'
    // }],
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    isDeleted:Date,
 tags:[{type:Types.ObjectId,ref:"User"}]
},{ timestamps: true ,toObject:{versionKey:true},toJSON:{versionKey:true}});
PostSchema.virtual('comments',{
    localField:'_id',
    foreignField:'postId',
    ref:'Comment',
    justOne:true    
})
const postModel = mongoose.models.Post || model('Post', PostSchema);
export default postModel;