import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, gql} from '@apollo/client';
import {onError} from '@apollo/client/link/error'
import GetUsers from './components/GetUsers';

// const errorLink = onError(({graphqlErrors, networkErrors})=>{
//   if(graphqlErrors){
//     graphqlErrors.map(({message, location, path})=>{
//       alert(`GraphQL error ${message}`);
//     })
//   }
// })
// const link = from([
//   errorLink,
//   new HttpLink({url: "http://localhost:3000/graphql"})
// ])
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: link
// })

const client = new ApolloClient({
  uri: 'http://localhost:4000/api/',
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query fuu {
        user(id: "65a8006c12218359556d104c"){
          Comments{
            comment
            commenter{
              username
            }
            commentedPost{
              id
              message
              likes{
                username
              }
              Comments{
                commenter{
                  username
                }
              }
            }
          }
          
        }
      }
    `,
  })
  .then((result) => console.log(result));

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       {" "}
//       <GetUsers/>
//     </ApolloProvider>
//   );
// }

// export default App;
