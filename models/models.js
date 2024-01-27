const mongoose = require('mongoose');

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

const FriendSchema = new mongoose.Schema({
    user: String,
    friend: String,
})

const commentSchema = new mongoose.Schema({
  post_id: String,
  comment: String,
  commented_by: String,
})


const users = mongoose.model('users', userSchema);
const posts = mongoose.model('posts', postSchema);
const likes = mongoose.model('likes', likeSchema);
const friends = mongoose.model('friends', FriendSchema);
const comments = mongoose.model('comments', commentSchema);

module.exports = { users, posts, likes, friends, comments};
