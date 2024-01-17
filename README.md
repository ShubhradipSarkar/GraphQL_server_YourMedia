## GraphQL server using Express


### Requirements

- a graphQL server serving as backend for our application
    - users
    - posts
     
- user (id : id) : returns a single user
- users : return all users
- user ( id: id, friend) : returns user who are friends of a user
- posts : all posts
- post (id : id) : return posts for a user with userid : id
- friends (id : user_id) : returns friends of a user with userid : user_id
- likes (id : post_id) : returns all likes of post with id : post_id




- a database for graphql to interract with (eg. mongodb atlas)
- a caching mechanism (redis)