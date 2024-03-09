const mongoose = require('mongoose');
const BlacklistSchema = new mongoose.Schema(
  {
      token: {
          type: String,
          required: true,
          ref: 'users',
      },
  },
  { timestamps: true }
);
const userSchema = new mongoose.Schema({
  
  username: {type:String, required:true},
  password: {type:String, required:true},
  email: {type: String, required:true},
  age: String,
  city: String,
  School: String,
  Relationship: String,
  work: String,
  gender: String,

});

const postSchema = new mongoose.Schema({
  message: String,
  user: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const likeSchema = new mongoose.Schema({
  post_id: String,
  liked_by: String,
});
likeSchema.index({ post_id: 1, liked_by: 1 }, { unique: true });

const FriendSchema = new mongoose.Schema({
    user: String,
    friend: String,
})

const commentSchema = new mongoose.Schema({
  post_id: String,
  comment: String,
  commented_by: String,
})

const nottificationSchema = new mongoose.Schema({
  post_id: String,
  post_of: String,
  type: String,
  user: String,
})

const users = mongoose.model('users', userSchema);
const posts = mongoose.model('posts', postSchema);
const likes = mongoose.model('likes', likeSchema);
const friends = mongoose.model('friends', FriendSchema);
const comments = mongoose.model('comments', commentSchema);
const blacklist = mongoose.model('blacklist', BlacklistSchema);
const notifications = mongoose.model('notifications', nottificationSchema);
module.exports = { users, posts, likes, friends, comments, blacklist, notifications};
