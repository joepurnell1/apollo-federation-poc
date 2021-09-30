const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const { readFileSync } = require('fs');

const supergraphSdl = readFileSync('./gateway/supergraph.graphql').toString();


const gateway = new ApolloGateway({
  supergraphSdl
});

const server = new ApolloServer({
  gateway,
});

/* Service List
  const gateway = new ApolloGateway({
   serviceList: [
     { name: 'movies', url: 'http://localhost:4001/graphql' },
     { name: 'actors', url: 'http://localhost:4002/graphql' }
     { name: 'reviews', url: 'http://localhost:4003/graphql' }
   ]
 });
*/

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
}).catch(err => {console.error(err)});