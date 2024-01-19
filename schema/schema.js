
const graphql = require("graphql");

const { users, posts, likes, friends, Groups, Comments} = require('../models/models');

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
        group:{
            type: GroupType,
            args: {
                group_id:{type: graphql.GraphQLString}
            },
            resolve : async(parent, args)=>{
                const groupId=args.group_id
                console.log(groupId)
                const GroupWithId=await Groups.find({_id:groupId})
                console.log(GroupWithId);
                return GroupWithId[0]
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
        }
    })
})

const UserType = new graphql.GraphQLObjectType({
    name : 'User',
    fields : ()=>({
        id : {type : graphql.GraphQLString},
        username : {type : graphql.GraphQLString},
        posts : {
            type : graphql.GraphQLList(PostType),
            resolve : async(parent,args)=>{
                const userid = parent._id;
                const tit = await posts.find();
                console.log(tit);
                const filtered_posts = await posts.find({user : userid});
                return filtered_posts;
            }
        },

        friends: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args) => {
                const own_id = parent._id;
                //console.log(own_id);     // from parent
                
                const all = await friends.find();
                //console.log(all)         // finding all friends

                console.log(own_id);
                console.log(typeof(own_id._id))

                console.log(all[0].user)
                console.log(typeof(all[0].user))

                console.log(own_id===all[0].user)

                const userFriends = await friends.find({user:own_id});
                console.log("....",userFriends)


                const friendIds = userFriends.map((friend) => friend.friend_id);
                try {
                    const Users = await users.find({ _id: { $in: friendIds } });
                    return Users;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error fetching friends');
                }
                
            },
        },

    })
});

const GroupType = new graphql.GraphQLObjectType({
    name: 'Group',
    fields : ()=>({
        name: {type: graphql.GraphQLString},
        people: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args)=>{
                const usersOfGroup = await users.find()
            }
        },
        
        group_posts: {type: graphql.GraphQLList(PostType)},

    })
})

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