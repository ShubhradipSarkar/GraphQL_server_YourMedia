const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
});
const users = mongoose.model('users', userSchema);

const postSchema = new mongoose.Schema({
  message: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
  
});
const posts = mongoose.model('posts', postSchema);

const likeSchema = new mongoose.Schema({
  post_id: {type: mongoose.Schema.Types.ObjectId, ref:'posts'},
  liked_by: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
});
const likes = mongoose.model('likes', likeSchema);

const FriendSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    friend: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
})
const friends = mongoose.model('friends', FriendSchema);

const groupSchema = new mongoose.Schema({
  name: String,
  people: [{type: mongoose.Schema.Types.ObjectId, ref:'users'}],
  group_posts: [{type: mongoose.Schema.Types.ObjectId, ref:'posts'}],
});
const Groups = mongoose.model('Groups', groupSchema);

const CommentSchema = new mongoose.Schema({
  post_id: {type: mongoose.Schema.Types.ObjectId, ref:'posts'},
  commented_by: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
})
const Comments = mongoose.model('Comments', CommentSchema);


module.exports = { users, posts, likes, friends, Groups, Comments};
