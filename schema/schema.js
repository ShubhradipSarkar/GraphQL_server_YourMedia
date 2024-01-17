const graphql = require("graphql");

const { users, posts, likes, friends} = require('../models/models');

const QueryRoot  = new graphql.GraphQLObjectType({
    name : 'Query',
    fields : () => ({
        hello : {
            type : graphql.GraphQLString,
            resolve : ()=> "Hello from graphQL!"
        },
        user : {
            type : UserType,
            args : {
                id : { type : graphql.GraphQLString }
            },
            resolve : async(_,args)=>{
                const userid = args.id;
                const filtered_users = await users.find({id: userid});
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
                const filtered_post = await posts.find({id: Number(postid)});
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
                const filtered_users = await users.find({id:userid});
                return filtered_users[0];
            }
        },
        // TASK
        likes:{
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args)=>{
                const post_id = parent.id;
                
                const likers = await likes.find({ post_id });
                   
                const likerIds = likers.map((like) => like.liked_by);
                try {
                    const UsersWhoLiked = await users.find({ id: { $in: likerIds } });
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
                const userid = parent.id;
                const filtered_posts = await posts.find({user : userid});
                return filtered_posts;
            }
        },

        friends: {
            type: graphql.GraphQLList(UserType),
            resolve: async(parent, args) => {
                const own_id = parent.id;
                const userFriends = await friends.find({id:own_id});
                const friendIds = userFriends.map((friend) => friend.friend_id);
                try {
                    const Users = await users.find({ id: { $in: friendIds } });
                    return Users;
                } catch (error) {
                    console.error('Error:', error.message);
                    throw new Error('Error fetching friends');
                }
                
            },
        },

    })
});


const RootSchema = new graphql.GraphQLSchema({query : QueryRoot});


module.exports = {RootSchema};