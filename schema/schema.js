
const graphql = require("graphql");

const { users, posts, likes, friends, comments} = require('../models/models');

const QueryRoot  = new graphql.GraphQLObjectType({
    name : 'Query',
    fields : () => ({
        hello : {
            type : graphql.GraphQLString,
            resolve : ()=> "Hello from graphQL!!"
        },
        user : {
            type : UserType,
            args : {
                id : { type : graphql.GraphQLString }
            },
            resolve : async(_,args)=>{
                const userid = args.id;
                const filtered_users = await users.find({_id: userid});
                return filtered_users[0]
            }
        },
        
        post : {
            type : PostType,
            args : {
                post_id : { type : graphql.GraphQLString}
            },
            resolve : async(_,args)=>{
                const postid=args.post_id
                const filtered_post = await posts.find({_id: postid});
                return filtered_post[0]
            }
        },
        posts : {
            type : graphql.GraphQLList(PostType),
            args : {
                user_id : { type : graphql.GraphQLString}
            },
            resolve : async(parent,args)=>{
                const userid = args.user_id
                const filtered_posts = await posts.find({user : userid})
                
                return filtered_posts
            }
        },
        users:{
            type: graphql.GraphQLList(UserType),
            resolve: async()=>{
                const allUsers = await users.find();
                console.log(allUsers);
                return allUsers
            }

        }

        
    })
});


const PostType = new graphql.GraphQLObjectType({
    name : 'Post',
    fields : ()=>({
        id : {type : graphql.GraphQLString},
        message : {type : graphql.GraphQLString},
        user : {
            type : UserType,
            resolve : async(post,args)=>{
                const userid = post.user;
                const filtered_users = await users.find({_id:userid});
                return filtered_users[0];
            }
        },
        // TASK
        Comments:{
            type: graphql.GraphQLList(CommentType),
            resolve: async(post, args) =>{
                const post_id = post._id;
                const commenters = await comments.find({post_id:post_id});
                //console.log('...',commenters.comment)
                return commenters
            }
        },
        likes:{
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args)=>{
                const post_id = parent._id;
                
                const likers = await likes.find({ post_id : post_id });
                   
                const likerIds = likers.map((like) => like.liked_by);
                try {
                    const UsersWhoLiked = await users.find({ _id: { $in: likerIds } });
                    return UsersWhoLiked;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error fetching likes');
                }

                return likers;
            }
        },
        
    })
})

const CommentType = new graphql.GraphQLObjectType({
    name : 'Comment',
    fields : ()=>({
        id: {type: graphql.GraphQLString},
        comment : {type: graphql.GraphQLString},
        commenter: {
            type: UserType,
            resolve: async(parent, args)=>{
                
                const commenterId=parent.commented_by;
                
                const commenter = await users.find({_id: commenterId});
                //console.log(commenter)
                return commenter[0];
            },
        },
        
        commentedPost: {
            type:PostType,
            resolve: async(parent, args)=>{
                const postId = parent.post_id;
                const postCommented = await posts.findOne({_id: postId});
                return postCommented;
            }
        },

        
        
    })
})

const UserType = new graphql.GraphQLObjectType({
    name : 'User',
    fields : ()=>({
        id : {type : graphql.GraphQLString},
        username : {type : graphql.GraphQLString},
        // email: {type: String, required:true},
        age: {type : graphql.GraphQLString},
        city: {type : graphql.GraphQLString},
        School: {type : graphql.GraphQLString},
        Relationship: {type : graphql.GraphQLString},
        work: {type : graphql.GraphQLString},
        gender: {type : graphql.GraphQLString},
        posts : {
            type : graphql.GraphQLList(PostType),
            resolve : async(parent,args)=>{
                const userid = parent._id;
                
                const filtered_posts = await posts.find({user : userid});
                return filtered_posts;
            }
        },

        friends: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args) => {
                const own_id = parent._id;
                const userFriends = await friends.find({user:own_id});
                const friendIds = userFriends.map((friend) => friend.friend);
                try {
                    const Users = await users.find({ _id: { $in: friendIds } });
                    return Users;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error fetching friends');
                }
                
            },
        },
        Comments:{
            type: graphql.GraphQLList(CommentType),
            resolve: async(parent, args)=>{
                const userId = parent._id;
                const commentsByUser = await comments.find({commented_by: userId});
                return commentsByUser;
            }
        }

    })
});


const MutationRoot = new graphql.GraphQLObjectType({
    name : 'Mutation',
    fields : ()=>({
        addUser : {
            type : UserType,
            args : {
                username : {type : graphql.GraphQLString},
            },
            resolve : async(_, args)=>{
                const user = new users({
                    username: args.username,
                })
                try {
                    const savedUser = await user.save();
                    return savedUser;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error adding User');
                }
            }
        },
        addFriend : {
            type : UserType,
            args : {
                id : {type : graphql.GraphQLString},
                friend_id : {type : graphql.GraphQLString}
            },
            resolve : async(_,args) => {
                const friend = new friends({
                    id : args.id,
                    friend_id : args.friend_id,
                });
                try {
                    const savedFriend = await friend.save();
                    return savedFriend;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error adding Friend');
                }
            }
        },
        addLikes : {
            type : PostType,
            args : {
                post_id : {type : graphql.GraphQLString},
                liked_by : {type : graphql.GraphQLString}
            },
            resolve : async(_,args) => {
                const like = new likes({
                    post_id : args.post_id,
                    liked_by : args.liked_by,
                });
                try {
                    const savedLike = await like.save();
                    return savedLike;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error adding Like');
                }
            }
        },
        addPost : {
            type : PostType,
            args : {
                message : { type : graphql.GraphQLString},
                user : {type : graphql.GraphQLString}
            },
            resolve : async(_,args)=>{
                const post = new posts({
                    
                    message : args.message,
                    user : args.user
                });
                try {
                    const savedPost = await post.save();
                    return savedPost;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error adding post');
                }
            }
        }

    })
});

const RootSchema = new graphql.GraphQLSchema({query : QueryRoot, mutation : MutationRoot});

module.exports = {RootSchema};