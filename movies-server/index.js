const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/federation');

const { moviesSource } = require('./data');

const typeDefs = gql`
  type Movie @key(fields: "id") {
    id: ID!
    title: String!
    releaseDate: String!
  }

  type Query {
    movies: [Movie]!
    movie(title: String!): Movie
  }
`;

const declareSelf = () => {
  console.log('📽 - Movies server called');
}

const fetchMoviebyId = (id) => {
  return moviesSource.find(movie => movie.id === id)};

const resolvers = {
  Query: {
    movies: () => {declareSelf(); return moviesSource},
    movie: (parent, args, context, info) => moviesSource.find(movie => movie.title === args.title)
  },

  Movie: {
    __resolveReference(reference) {
      return fetchMoviebyId(reference.id);
    }
  }
};

// const server = new ApolloServer({ typeDefs, resolvers });
const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });


server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`📽  Server ready at ${url}`);
});