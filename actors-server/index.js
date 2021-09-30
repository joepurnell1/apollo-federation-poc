const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/federation');

const { actorsSource } = require('./data');

const typeDefs = gql`
  type Actor @key(fields: "id") {
    id: ID!
    firstname: String!
    lastname: String
    movies: [Movie]
  }

  extend type Movie @key(fields: "id") {
    id: ID! @external
    cast: [Actor]
  }

  extend type Query {
    actor: Actor
    actors: [Actor]!
    actorByName(firstname: String!, lastname: String!): Actor
  }
`;

const declareSelf = () => {
  console.log('🎭 - Actors server called');
}

const fetchCastForMovie = (movieId) => {
  declareSelf();
  const cast = [];
  actorsSource.forEach(({
    firstname,
    lastname, 
    id, 
    movies,
  }) => {
    movies.forEach(movie => {
      if (movie === movieId) {
        cast.push({
          firstname,
          lastname,
          id,
          movies,
        })
      }      
    })
  })
  return cast;
}

const resolvers = {
  Query: {
    actor: (id) => {declareSelf(); return actorsSource.find(actor => actor.id === id)},
    actors: () => {declareSelf(); return actorsSource},
    actorByName: (parent, {firstname, lastname}, context, info) => {declareSelf(); return actorsSource.find(actor => actor.firstname === firstname && actor.lastname === lastname)},
  },

  Actor: {
    movies(actor) {
      return actor.movies.map((id) => ({ __typename: "Movie", id }))
    }
  },

  Movie: {
    cast(movie) {
      return fetchCastForMovie(movie.id);
    }
  }
};

const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });


server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🎭  Server ready at ${url}`);
});