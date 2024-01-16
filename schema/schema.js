const graphql = require("graphql");

// list of posts made by a user with id userid
posts = [
    { id : 1 , message : "post1" , user : "1"},
    { id : 2 , message : "post2" , user : "2"},
    { id : 3 , message : "post3" , user : "1"},
    { id : 4 , message : "post4" , user : "1"},
    { id : 5 , message : "post5" , user : "2"},
    { id : 6 , message : "post6" , user : "2"},
]

users = [
    {id : "1" , username : "moinak"},
    { id : "2" , username : "shubhradip"}
]

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
            resolve : (_,args)=>{
                const userid = args.id;
                const filtered_users = users.filter((user)=>
                    user.id === userid?user:null
                );
                return filtered_users[0]
            }
        },
        
        post : {
            type : PostType,
            args : {
                post_id : { type : graphql.GraphQLString}
            },
            resolve : (_,args)=>{
                const filtered_post = posts.filter((post)=>
                    post.id == args.post_id?post:null
                );
                return filtered_post[0]
            }
        },

        posts : {
            type : graphql.GraphQLList(PostType),
            args : {
                user_id : { type : graphql.GraphQLString}
            },
            resolve : (parent,args)=>{
                const userid = args.user_id
                const filtered_posts =  posts.filter((post)=>{
                    console.log(post.user === userid)
                    if(post.user === userid) return post
                })
                console.log(filtered_posts)
                return filtered_posts
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
            resolve : (post,args)=>{
                const userid = post.user;
                const filtered_users = users.filter((user)=>
                    user.id === userid?user:null
                );
                return filtered_users[0]
            }
        },
    })
})

const UserType = new graphql.GraphQLObjectType({
    name : 'User',
    fields : ()=>({
        id : {type : graphql.GraphQLString},
        username : {type : graphql.GraphQLString},
        posts : {
            type : graphql.GraphQLList(PostType),
            resolve : (parent,args)=>{
                const userid = parent.id;
                const filtered_posts =  posts.filter((post)=>{
                    console.log(post.user === userid)
                    if(post.user === userid) return post
                })
                return filtered_posts
            }
        }
    })
});


const RootSchema = new graphql.GraphQLSchema({query : QueryRoot});


module.exports = {RootSchema};