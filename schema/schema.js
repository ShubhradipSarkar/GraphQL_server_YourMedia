
const graphql = require("graphql");
//const {GraphQLDateTime} = require("graphql-iso-date")

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
        createdAt: {type: graphql.GraphQLString},
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
const addFriendType = new graphql.GraphQLObjectType({
    name: 'AddFriend',
    fields: ()=>({
        user: {type: graphql.GraphQLString},
        friend: {type: graphql.GraphQLString}
    })
})
const addPostType = new graphql.GraphQLObjectType({
    name: 'AddPost',
    fields: ()=>({
        user: {type: graphql.GraphQLString},
        message: {type: graphql.GraphQLString},
        createdAt: {type: graphql.GraphQLString}
    })
})
const addLikeType = new graphql.GraphQLObjectType({
    name: 'AddLike',
    fields: ()=>({
        post_id:{type: graphql.GraphQLString},
        liked_by:{type: graphql.GraphQLString}
    })
});
const removeLikesType = new graphql.GraphQLObjectType({
    name: 'RemoveLikes',
    fields: () => ({
      success: { type: graphql.GraphQLBoolean },
      message: { type: graphql.GraphQLString },
    }),
  });
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
        users:{
            type: graphql.GraphQLList(UserType),
            
            resolve: async(parent, args)=>{
                const allUsers = await users.find();
                const friendList = await friends.find();
                const all = allUsers.map(async(user)=>{
                    const direction1 = await friends.findOne({user: user.id, friend: parent.id});
                    const direction2 = await friends.findOne({user: parent.id, friend: user.id});
                    if(user.id===parent.id){
                        user.presentInFriends = "";
                    }
                    else if(direction1 && direction2){
                        user.presentInFriends = "Disconnect";
                    }
                    else if(direction1 && !direction2){
                        user.presentInFriends = "Accept...";
                    }
                    else if(!direction1 && direction2){
                        user.presentInFriends = "Sent...";
                    }
                    else{
                        user.presentInFriends = "Connect";
                    }
                    return user;
                })
                //console.log(all);
                return all
            }

        },
        posts : {
            type : graphql.GraphQLList(PostType),
            resolve : async(parent,args)=>{
                const userid = parent._id;
                
                const filtered_posts = await posts.find({user : userid});
                return filtered_posts;
            }
        },
        presentInFriends: {
           type: graphql.GraphQLString
        },
        friendRequests: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args) => {
                const user = parent._id;
                const userFriends = await friends.find({friend: user});
                const friendIds = userFriends.map((friend) => friend.user);
                
                try {
                    const Users = await users.find({ _id: { $in: friendIds } });
                    
                    const RealRequests = Users.map(async(userittr)=>{
                        const currUser = userittr;
                       
                        const isFriendAlready = await friends.findOne({user: user._id, friend:currUser._id});
                        
                        if(isFriendAlready===null){
                            return currUser
                        }
                    })

                    return RealRequests
                    
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error fetching friends');
                }
            }
        },
        friends: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args) => {
                const own_id = parent._id;
                const userFriends = await friends.find({friend:own_id});
                const friendIds = userFriends.map((friend) => friend.user);
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
        },
        Feed:{
            type: graphql.GraphQLList(PostType),
            resolve: async(parent, args)=>{
                const userId = parent.id;
                const Friends = await friends.find({friend: userId});
                
                Friends.push({user:parent.id});
                const postsForFriends = await Promise.all(
                    Friends.map(async (friend) => {
                        return await posts.find({ user: friend.user });
                    })
                );
                
                const FeedPosts = postsForFriends.flat();
                const sortedData = FeedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                return sortedData
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
            type : addFriendType,
            args : {
                user : {type : graphql.GraphQLString},
                friend : {type : graphql.GraphQLString}
            },
            resolve : async(_,args) => {
                const friend = new friends({
                    user : args.user,
                    friend : args.friend,
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
            type : addLikeType,
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
        removeLikes: {
            type: removeLikesType,
            args: {
              post_id: { type: graphql.GraphQLString },
              liked_by: { type: graphql.GraphQLString },
            },
            resolve: async (_, args) => {
              try {
                const removedLike = await likes.findOneAndDelete({
                  post_id: args.post_id,
                  liked_by: args.liked_by,
                });
      
                if (removedLike) {
                  return { success: true, message: 'Like removed successfully' };
                } else {
                  return { success: false, message: 'Like not found' };
                }
              } catch (error) {
                console.error('Error:', error.message);
                throw new Error('Error removing Like');
              }
            },
        },    
        addPost : {
            type : addPostType,
            args : {
                message : { type : graphql.GraphQLString},
                user : {type : graphql.GraphQLString},
                createdAt: {type: graphql.GraphQLString}
            },
            resolve : async(_,args)=>{
                const post = new posts({
                    
                    message : args.message,
                    user : args.user,
                    createdAt: args.createdAt
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