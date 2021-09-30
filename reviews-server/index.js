const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/federation');

const { reviewsSource } = require('./data');

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    movie: Movie!
    rating: Int!
    review: String!
  }

  extend type Movie @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }
`;

const declareSelf = () => {
  console.log('📝 - Review server called');
}

const fetchReviewForMovie = (movieId) => {
  declareSelf();
  const reviews = [];

  reviewsSource.forEach(({
    id,
    movie,
    rating,
    review,
  }) => {
    if (movie === movieId) {
      reviews.push({
        id,
        movie,
        rating,
        review,
      })
    }  
  })

  return reviews;
}

const resolvers = {
  Review: {
    movie(review) {
      return { __typename: "Movie", id: review.movie }
    }
  },

  Movie: {
    reviews(movie) {
      return fetchReviewForMovie(movie.id);
    }
  }
};

const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });


server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`📝  Server ready at ${url}`);
});