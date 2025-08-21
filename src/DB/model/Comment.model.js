import mongoose, { Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: function () {
      return !(this.attachments?.length);
    },
    minlength: 2,
    maxlength: 50000,
    trim: true
  },
  attachments: [{
    secure_url: String,
    public_id: String
  }],
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Types.ObjectId,
    ref: 'Comment'
  }],
  updatedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: Types.ObjectId,
    ref: 'Post',
    required: true
  },
  commentId: {
    type: Types.ObjectId,
    ref: 'Comment'
  },
  deletedBy: {
    type: Types.ObjectId,
    ref: 'User'
  },
  isDeleted: Date,
  tags: [{
    type: Types.ObjectId,
    ref: "User"
  }]
}, { 
  timestamps: true,
  toObject: { versionKey: true },
  toJSON: { versionKey: true }
});

commentSchema.virtual("replay", {
  localField: "_id",
  foreignField: "commentId",
  ref: "Comment"
});

const commentModel = mongoose.models.Comment || model('Comment', commentSchema);
export default commentModel;
