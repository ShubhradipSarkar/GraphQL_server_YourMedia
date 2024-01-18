const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  username: String,
});

const postSchema = new mongoose.Schema({
  message: String,
  user: String,
});

const likeSchema = new mongoose.Schema({
  post_id: String,
  liked_by: String,
});

const FriendSchema = new mongoose.Schema({
    id: String,
    friend_id: String,
})

const users = mongoose.model('users', userSchema);
const posts = mongoose.model('posts', postSchema);
const likes = mongoose.model('likes', likeSchema);
const friends = mongoose.model('friends', FriendSchema);

module.exports = { users, posts, likes, friends};
